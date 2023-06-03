#include "SZThread.h"
#include "SZCommon.h"

#include <stdint.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <execinfo.h>
#include <cstdlib>
#include <cstring>

namespace SZ
{

void SZ_Thread::start()
{
    try
    {
        if (nullptr == thread_)
        {
            thread_ = new std::thread(&SZ_Thread::run, this);
        }
    }
    catch (const std::exception &e)
    {
        throw SZ_Thread_Exception(std::string("start error: ") + e.what());
    }
}

void SZ_Thread::stop()
{
    try
    {
        if (nullptr != thread_)
        {
            finish();
            join();
            delete thread_;
            thread_ = nullptr;
        }
    }
    catch (const std::exception &e)
    {
        throw SZ_Thread_Exception(std::string("stop error: ") + e.what());
    }
}

void SZ_Thread::join()
{
    if (nullptr != thread_)
    {
        if (thread_->joinable())
        {
            thread_->join();
        }
    }
}

void SZ_Thread::detach()
{
    if (nullptr != thread_)
    {
        thread_->detach();
    }
}

std::thread *SZ_Thread::handle()
{
    return thread_;
}

long SZ_ThisThread::tid()
{
    thread_local long id = ::syscall(SYS_gettid);

    return id;
}

bool SZ_ThisThread::isMain()
{
    return tid() == ::getpid();
}

std::string SZ_ThisThread::stacktrace(size_t num)
{
    void *bt[num];
    bzero(bt, sizeof(bt));

    int level = ::backtrace(bt, num);
    char **bts = ::backtrace_symbols(bt, level);
    std::string str;

    for (int i = 0; i < level; ++i)
    {
        str += "[" + SZ::SZ_Common::toString(i) + "] ";
        str += bts[i];
        str += "\n";
    }
    free(bts);

    return str;
}

} // namespace SZ
