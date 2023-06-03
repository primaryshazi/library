#ifndef SZLIBRARY_SZTHREAD_H
#define SZLIBRARY_SZTHREAD_H

#include "SZException.h"
#include "SZUncopy.h"

#include <thread>
#include <string>
#include <memory>

namespace SZ
{

class SZ_Thread_Exception : public SZ_Exception
{
public:
    SZ_Thread_Exception(const std::string &sErr) : SZ_Exception("SZ_THREAD", sErr) {}
    virtual ~SZ_Thread_Exception() noexcept {}
};

class SZ_Thread : public SZ_Uncopy
{
public:
    SZ_Thread() : thread_(nullptr) {}

    virtual ~SZ_Thread() {}

    virtual void start() final;

    virtual void stop() final;

    virtual void join() final;

    virtual void detach() final;

    std::thread *handle();

protected:
    virtual void run() = 0;

    virtual void finish() = 0;

private:
    std::thread *thread_;
};

typedef std::shared_ptr<SZ_Thread> SZ_ThreadPtr;

class SZ_ThisThread
{
public:
    static long tid();

    static bool isMain();

    static std::string stacktrace(size_t num = 16);
};

} // namespace SZ

#endif  // SZLIBRARY_SZTHREAD_H
