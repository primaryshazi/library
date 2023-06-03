#include "SZThreadPool.h"
#include "SZCommon.h"

#include <iostream>

namespace SZ
{

SZ_ThreadPool::SZ_ThreadPool() : isStart_(false), poolNum_(0), activeNum_(0)
{
}

SZ_ThreadPool::~SZ_ThreadPool()
{
    stop();
}

void SZ_ThreadPool::start(size_t num)
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

void SZ_ThreadPool::stop()
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

void SZ_ThreadPool::wait(int64_t timeout)
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
        poolCond_.wait(locker, [&]() { return 0 == activeNum_.load() && queTasks_.isEmpty(); });
    }
    else if (timeout > 0)
    {
        poolCond_.wait_for(locker, std::chrono::milliseconds(timeout), [&]() { return 0 == activeNum_.load() && queTasks_.isEmpty(); });
    }
}

size_t SZ_ThreadPool::pools() const
{
    return poolNum_.load();
}

size_t SZ_ThreadPool::tasks() const
{
    return queTasks_.size();
}

size_t SZ_ThreadPool::actives() const
{
    return activeNum_.load();
}

bool SZ_ThreadPool::isStarted() const
{
    return isStart_.load();
}

size_t SZ_ThreadPool::capacity(size_t cap)
{
    return queTasks_.capacity(cap);
}

void SZ_ThreadPool::run()
{
    TaskFuncPtr task = nullptr;

    // 当线程池存在时，每条线程持续该循环
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
            if (task && (0 == task->expire_ || task->expire_ >= SZ_Common::nowms()))
            {
                task->func_();
            }
            task = nullptr;
        }
        catch (const std::exception &e)
        {
            std::cerr << SZ_FILE_FUNC_LINE << e.what() << std::endl;
        }
        catch (...)
        {
            std::cerr << SZ_FILE_FUNC_LINE << "unknown exception" << std::endl;
        }
        --activeNum_;

        if (0 == activeNum_.load() && queTasks_.isEmpty())
        {
            poolCond_.notify_all();
        }
    }
}

} // namespace SZ
