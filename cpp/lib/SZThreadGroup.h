#ifndef SZLIBRARY_SZTHREADGROUP_H
#define SZLIBRARY_SZTHREADGROUP_H

#include "SZException.h"
#include "SZThread.h"
#include "SZUncopy.h"

#include <mutex>
#include <atomic>
#include <set>

namespace SZ
{

class SZ_ThreadGroup_Exception : public SZ_Exception
{
public:
    SZ_ThreadGroup_Exception(const std::string &sErr) : SZ_Exception("SZ_THREADGOURP", sErr) {}
    virtual ~SZ_ThreadGroup_Exception() noexcept {}
};

class SZ_ThreadGroup : public SZ_Uncopy
{
public:
    SZ_ThreadGroup();

    ~SZ_ThreadGroup();

    void start();

    void stop();

    /**
     * @brief 注册对象
     *
     * @param ptr
     */
    void regist(SZ_ThreadPtr &ptr);

    /**
     * @brief 移除对象
     *
     * @param ptr
     */
    void unregist(SZ_ThreadPtr &ptr);

protected:
    struct KeyComp
    {
        bool operator()(const SZ_ThreadPtr &one, const SZ_ThreadPtr &two) const
        {
            return one.get() < two.get();
        }
    };

private:
    std::atomic_bool isStart;
    std::mutex mtx_;
    std::set<SZ_ThreadPtr, KeyComp> objects_;     // id -> thread_object
};

} // namespace SZ

#endif  // SZLIBRARY_SZTHREADGROUP_H
