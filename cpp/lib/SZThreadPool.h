#pragma once

#include "SZCommon.h"
#include "SZUtility.h"
#include "SZThreadQueue.h"

#include <thread>
#include <future>
#include <mutex>
#include <atomic>
#include <condition_variable>
#include <functional>
#include <vector>
#include <iostream>

class SZ_ThreadPool_Exception : public SZ_Exception
{
public:
	SZ_ThreadPool_Exception(const std::string &sErr) : SZ_Exception(__FUNCTION__, sErr) {}
	virtual ~SZ_ThreadPool_Exception() noexcept {}
};

class SZ_ThreadPool : public SZ_Uncopy
{
public:
	typedef std::shared_ptr<std::function<void()>> TaskFuncPtr;

public:
	SZ_ThreadPool() : isStart_(false), poolNum_(0), activeNum_(0)
	{
	}

	~SZ_ThreadPool()
	{
		stop();
	}

	/**
	 * @brief
	 *
	 * @param num
	 */
	void start(size_t num = 0)
	{
		std::lock_guard<std::mutex> locker(poolMtx_);
		if (isStart_.exchange(true))
		{
			return;
		}

		poolNum_ = num == 0 ? std::thread::hardware_concurrency() : num;

		vThreads_.clear();
		for (size_t i = 0; i < poolNum_.load(); i++)
		{
			vThreads_.emplace_back(std::thread(&SZ_ThreadPool::run, this));
		}
	}

	/**
	 * @brief
	 *
	 */
	void stop()
	{
		std::lock_guard<std::mutex> locker(poolMtx_);
		if (!isStart_.exchange(false))
		{
			return;
		}

		for (auto &t : vThreads_)
		{
			if (t.joinable())
			{
				t.join();
			}
		}
		vThreads_.clear();
	}

	/**
	 * @brief
	 *
	 * @param timeout
	 */
	void wait(int64_t timeout = -1)
	{
		std::unique_lock<std::mutex> locker(poolMtx_);
		if (!isStart_.load())
		{
			return;
		}

		if (0 == activeNum_.load() && queTasks_.isEmpty())
		{
			return;
		}

		if (timeout < 0)
		{
			poolCond_.wait(locker, [&]()
						   { return 0 == activeNum_.load() && queTasks_.isEmpty(); });
		}
		else if (timeout > 0)
		{
			poolCond_.wait_for(locker, std::chrono::milliseconds(timeout), [&]()
							   { return 0 == activeNum_.load() && queTasks_.isEmpty(); });
		}
	}

	/**
	 * @brief
	 *
	 * @tparam Func
	 * @tparam Args
	 * @param func
	 * @param args
	 * @return std::future<decltype(func(args...))>
	 */
	template <typename Func, typename... Args>
	auto insert(Func &&func, Args &&...args) -> std::future<decltype(func(args...))>
	{
		using func_ret_type = decltype(func(args...));

		auto spTask = std::make_shared<std::packaged_task<func_ret_type()>>(std::bind(std::forward<Func>(func), std::forward<Args>(args)...));
		TaskFuncPtr task = std::make_shared<std::function<void()>>([spTask]()
																   { (*spTask)(); });

		while (!queTasks_.push(task))
		{
			std::this_thread::yield();
		}

		return spTask->get_future();
	}

	/**
	 * @brief
	 *
	 * @tparam Func
	 * @tparam Args
	 * @param func
	 * @param args
	 * @return std::future<decltype(func(args...))>
	 */
	template <typename Func, typename... Args>
	auto try_insert(Func &&func, Args &&...args) -> std::future<decltype(func(args...))>
	{
		using func_ret_type = decltype(func(args...));

		auto spTask = std::make_shared<std::packaged_task<func_ret_type()>>(std::bind(std::forward<Func>(func), std::forward<Args>(args)...));
		TaskFuncPtr task = std::make_shared<std::function<void()>>([spTask]()
																   { (*spTask)(); });
		queTasks_.push(task);

		return spTask->get_future();
	}

	/**
	 * @brief
	 *
	 * @return size_t
	 */
	size_t pools() const
	{
		return poolNum_.load();
	}

	/**
	 * @brief
	 *
	 * @return size_t
	 */
	size_t tasks() const
	{
		return queTasks_.size();
	}

	/**
	 * @brief
	 *
	 * @return size_t
	 */
	size_t actives() const
	{
		return activeNum_.load();
	}

	/**
	 * @brief
	 *
	 * @return bool
	 */
	bool isStarted() const
	{
		return isStart_.load();
	}

	/**
	 * @brief
	 *
	 * @param cap
	 * @return size_t
	 */
	size_t capacity(size_t cap = 0)
	{
		return queTasks_.capacity(cap);
	}

protected:
	/**
	 * @brief
	 */
	void run()
	{
		TaskFuncPtr task = nullptr;

		while (isStart_.load())
		{
			if (!queTasks_.pop(task, 5))
			{
				if (0 == activeNum_.load() && queTasks_.isEmpty())
				{
					poolCond_.notify_all();
				}
				continue;
			}

			++activeNum_;
			try
			{
				if (task)
				{
					(*task)();
					task = nullptr;
				}
			}
			catch (const std::exception &e)
			{
				std::cerr << SZ_FILE_FUNC_LINE << e.what() << "\n";
			}
			catch (...)
			{
				std::cerr << SZ_FILE_FUNC_LINE << "unknown exception"
						  << "\n";
			}
			--activeNum_;

			if (0 == activeNum_.load() && queTasks_.isEmpty())
			{
				poolCond_.notify_all();
			}
		}
	}

private:
	std::mutex poolMtx_;
	std::condition_variable poolCond_;
	std::atomic_bool isStart_;

	std::atomic_size_t poolNum_;
	std::atomic_size_t activeNum_;

	std::vector<std::thread> vThreads_;
	SZ_ThreadQueue<TaskFuncPtr> queTasks_;
};
