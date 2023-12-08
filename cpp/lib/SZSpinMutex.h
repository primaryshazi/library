#pragma once

#include "SZUtility.h"

#include <atomic>

class SZ_SpinMutex : public SZ_Uncopy
{
public:
    SZ_SpinMutex();

    ~SZ_SpinMutex();

    void lock();

    bool try_lock();

    void unlock();

private:
    std::atomic_flag flag_;
};
