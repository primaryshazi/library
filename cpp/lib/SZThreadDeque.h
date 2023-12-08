#pragma once

#include "SZUtility.h"

#include <deque>
#include <condition_variable>
#include <chrono>
#include <atomic>

template <typename T, typename Container = std::deque<T>>
class SZ_ThreadDeque : public SZ_Uncopy
{
public:
	typedef T value_type;
	typedef Container container_type;

public:
	SZ_ThreadDeque() : SZ_ThreadDeque(0x7FFF) {}

	explicit SZ_ThreadDeque(size_t cap) : size_(0), capacity_(cap) {}

	~SZ_ThreadDeque() {}

	/**
	 * @brief 是否为空
	 *
	 * @return bool
	 */
	bool isEmpty() const
	{
		return size() == 0;
	}

	/**
	 * @brief 元素个数
	 *
	 * @return size_t
	 */
	size_t size() const
	{
		return size_.load();
	}

	/**
	 * @brief 清空元素
	 */
	void clear()
	{
		container_type temp;
		{
			std::lock_guard<std::mutex> locker(mtx_);

			deque_.swap(temp);
			size_.store(0);
		}
	}

	/**
	 * @brief 参数为0时，返回最大容量
	 *        参数大于0时，设置最大容量并返回原有容量
	 *
	 * @param cap
	 * @return size_t
	 */
	size_t capacity(size_t cap = 0)
	{
		if (cap > 0)
		{
			return capacity_.exchange(cap);
		}

		return capacity_.load();
	}

	/**
	 * @brief 从前端推入元素
	 *
	 * @param element
	 * @return bool
	 */
	bool push_front(const value_type &element)
	{
		bool hadPush = false; // 标志是否成功推入元素

		if (size_.load() < capacity_.load())
		{
			std::lock_guard<std::mutex> locker(mtx_);
			if (size_.load() < capacity_.load())
			{
				deque_.emplace_front(element);
				++size_;
				hadPush = true;
			}
		}
		cond_.notify_all();

		return hadPush;
	}

	/**
	 * @brief 从后端推入元素
	 *
	 * @param element
	 * @return bool
	 */
	bool push_back(const value_type &element)
	{
		bool hadPush = false; // 标志是否成功推入元素

		if (size_.load() < capacity_.load())
		{
			std::lock_guard<std::mutex> locker(mtx_);
			if (size_.load() < capacity_.load())
			{
				deque_.emplace_back(element);
				++size_;
				hadPush = true;
			}
		}
		cond_.notify_all();

		return hadPush;
	}

	/**
	 * @brief 指定超时时间从前端推出元素
	 *
	 * @param element
	 * @param timeout
	 * @return bool
	 */
	bool pop_fonrt(value_type &element, int64_t timeout = -1)
	{
		std::unique_lock<std::mutex> locker(mtx_);

		if (deque_.empty())
		{
			/**
			 * 永久阻塞
			 * 超时阻塞
			 */
			if (timeout < 0)
			{
				cond_.wait(locker, [&]
						   { return !deque_.empty(); });
			}
			else if (timeout > 0)
			{
				cond_.wait_for(locker, std::chrono::milliseconds(timeout), [&]
							   { return !deque_.empty(); });
			}
		}

		if (!deque_.empty())
		{
			element = std::move(deque_.front());
			deque_.pop_front();
			--size_;
			return true;
		}

		return false;
	}

	/**
	 * @brief 指定超时时间从后端推出元素
	 *
	 * @param element
	 * @param timeout
	 * @return bool
	 */
	bool pop_back(value_type &element, int64_t timeout = -1)
	{
		std::unique_lock<std::mutex> locker(mtx_);

		if (deque_.empty())
		{
			/**
			 * 永久阻塞
			 * 超时阻塞
			 */
			if (timeout < 0)
			{
				cond_.wait(locker, [&]
						   { return !deque_.empty(); });
			}
			else if (timeout > 0)
			{
				cond_.wait_for(locker, std::chrono::milliseconds(timeout), [&]
							   { return !deque_.empty(); });
			}
		}

		if (!deque_.empty())
		{
			element = std::move(deque_.back());
			deque_.pop_back();
			--size_;
			return true;
		}

		return false;
	}

	/**
	 * @brief 交换
	 *
	 * @param deq
	 */
	void swap(container_type &deq)
	{
		std::lock_guard<std::mutex> locker(mtx_);
		deque_.swap(deq);
		size_.store(deque_.size());
	}

private:
	std::mutex mtx_;			   // 保护队列
	std::condition_variable cond_; // 条件变量
	std::atomic_size_t size_;	   // 队列容量
	std::atomic_size_t capacity_;  // 最大容量
	container_type deque_;		   // 队列
};
