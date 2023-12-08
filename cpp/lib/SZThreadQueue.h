#pragma once

#include "SZUtility.h"

#include <queue>
#include <condition_variable>
#include <chrono>
#include <atomic>

template <typename T, typename Container = std::queue<T>>
class SZ_ThreadQueue : public SZ_Uncopy
{
public:
	typedef T value_type;
	typedef Container container_type;

public:
	SZ_ThreadQueue() : SZ_ThreadQueue(0x7FFF) {}

	explicit SZ_ThreadQueue(size_t cap) : size_(0), capacity_(cap) {}

	~SZ_ThreadQueue() {}

	bool isEmpty() const
	{
		return size() == 0;
	}

	size_t size() const
	{
		return size_.load();
	}

	void clear()
	{
		container_type temp;
		{
			std::lock_guard<std::mutex> locker(mtx_);

			queue_.swap(temp);
			size_.store(0);
		}
	}

	size_t capacity(size_t cap = 0)
	{
		if (cap > 0)
		{
			return capacity_.exchange(cap);
		}

		return capacity_.load();
	}

	bool push(const value_type &element)
	{
		bool hadPush = false;

		if (size_.load() < capacity_.load())
		{
			std::lock_guard<std::mutex> locker(mtx_);
			if (size_.load() < capacity_.load())
			{
				queue_.emplace(element);
				++size_;
				hadPush = true;
			}
		}
		cond_.notify_one();

		return hadPush;
	}

	bool pop(value_type &element, int64_t timeout = -1)
	{
		std::unique_lock<std::mutex> locker(mtx_);

		if (queue_.empty() && timeout != 0)
		{
			if (timeout < 0)
			{
				cond_.wait(locker, [&]
						   { return !queue_.empty(); });
			}
			else
			{
				cond_.wait_for(locker, std::chrono::milliseconds(timeout), [&]
							   { return !queue_.empty(); });
			}
		}

		if (!queue_.empty())
		{
			element = std::move(queue_.front());
			queue_.pop();
			--size_;
			return true;
		}

		return false;
	}

	bool swap(Container &que)
	{
		std::lock_guard<std::mutex> locker(mtx_);
		queue_.swap(que);
		size_.store(queue_.size());

		return true;
	}

private:
	std::mutex mtx_;
	std::condition_variable cond_;
	std::atomic_size_t size_;
	std::atomic_size_t capacity_;
	container_type queue_;
};
