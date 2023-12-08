#include "SZSpinMutex.h"

#include <thread>
#include <chrono>

SZ_SpinMutex::SZ_SpinMutex()
{
    flag_.clear();
}

SZ_SpinMutex::~SZ_SpinMutex()
{
}

void SZ_SpinMutex::lock()
{
    size_t i = 1;
    while (flag_.test_and_set())
    {
        if (i % 10 == 0)
        {
            std::this_thread::sleep_for(std::chrono::microseconds(10));
        }
        else
        {
            std::this_thread::yield();
        }
        ++i;
    }
}

bool SZ_SpinMutex::try_lock()
{
    int times = 10;
    for (; times > 0 && flag_.test_and_set(); --times)
    {
        std::this_thread::yield();
    }

    return times > 0;
}

void SZ_SpinMutex::unlock()
{
    flag_.clear();
}
