#ifndef SZLIBRARY_SZSPINMUTEX_H
#define SZLIBRARY_SZSPINMUTEX_H

#include "SZUncopy.h"

#include <atomic>

namespace SZ
{

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

} // namespace sZ

#endif  // SZLIBRARY_SZSPINMUTEX_H
