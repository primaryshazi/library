#include "SZThreadGroup.h"

#include <chrono>
#include <algorithm>
#include <memory>

namespace SZ
{

SZ_ThreadGroup::SZ_ThreadGroup() : isStart(false)
{
}

SZ_ThreadGroup::~SZ_ThreadGroup()
{
    stop();
}

void SZ_ThreadGroup::start()
{
    if (!isStart.exchange(true))
    {
        std::lock_guard<std::mutex> locker(mtx_);
        for (const auto &obj : objects_)
        {
            obj->start();
        }
    }
}

void SZ_ThreadGroup::stop()
{
    if (isStart.exchange(false))
    {
        std::lock_guard<std::mutex> locker(mtx_);
        for (const auto &obj : objects_)
        {
            obj->stop();
        }
    }
}

void SZ_ThreadGroup::regist(SZ_ThreadPtr &ptr)
{
    if (nullptr == ptr)
    {
        throw SZ_ThreadGroup_Exception("regist nullptr");
    }

    std::lock_guard<std::mutex> locker(mtx_);
    if (objects_.find(ptr) == objects_.end())
    {
        objects_.insert(ptr);
        if (isStart.load())
        {
            ptr->start();
        }
    }
}

void SZ_ThreadGroup::unregist(SZ_ThreadPtr &ptr)
{
    if (nullptr == ptr)
    {
        throw SZ_ThreadGroup_Exception("unregist nullptr");
    }

    std::lock_guard<std::mutex> locker(mtx_);
    if (objects_.find(ptr) != objects_.end())
    {
        objects_.erase(ptr);
        if (isStart.load())
        {
            ptr->stop();
        }
    }
}

} // namespace SZ
