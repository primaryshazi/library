#ifndef SZLIBRARY_SZTHREADPOOL_H
#define SZLIBRARY_SZTHREADPOOL_H

#include "SZUncopy.h"
#include "SZCommon.h"
#include "SZThreadQueue.h"

#include <thread>
#include <future>
#include <mutex>
#include <atomic>
#include <condition_variable>
#include <functional>
#include <vector>

namespace SZ
{

class SZ_ThreadPool : public SZ_Uncopy
{
public:
    SZ_ThreadPool();

    ~SZ_ThreadPool();

    /**
     * @brief 向线程池中加入任务，不限时
     *
     * @tparam Func
     * @tparam Args
     * @param func
     * @param args
     * @return std::future<decltype(func(args...))>
     */
    template <typename Func, typename... Args>
    auto insert(Func &&func, Args &&...args)->std::future<decltype(func(args...))>;

    /**
     * @brief 向线程池中加入任务，限时
     *
     * @tparam Func
     * @tparam Args
     * @param timeout
     * @param func
     * @param args
     * @return std::future<decltype(func(args...))>
     */
    template <typename Func, typename... Args>
    auto insert(int64_t timeout, Func &&func, Args &&...args)->std::future<decltype(func(args...))>;

    /**
     * @brief 启动线程池，不可连续多次启动一个线程池，可停止之后重启
     *
     * @param num
     */
    void start(size_t num = 4);

    /**
     * @brief 停止线程池
     */
    void stop();

    /**
     * @brief 等待任务执行完成
     *
     * @param timeout
     */
    void wait(int64_t timeout = -1);

    /**
     * @brief 获取线程池大小
     *
     * @return size_t
     */
    size_t pools() const;

    /**
     * @brief 获取任务列队中的任务的数量
     *
     * @return size_t
     */
    size_t tasks() const;

    /**
     * @brief 获取正在执行的线程数量
     *
     * @return size_t
     */
    size_t actives() const;

    /**
     * @brief 线程池是否已启动
     *
     * @return bool
     */
    bool isStarted() const;

    /**
     * @brief 设置/获取队列容量
     *
     * @param cap
     * @return size_t
     */
    size_t capacity(size_t cap = 0);

protected:
    /**
     * @brief 启动每一条线程
     */
    void run();

private:
    class TaskFunc
    {
    public:
        TaskFunc(int64_t expire, std::function<void()> func) : expire_(expire), func_(func) {}

        ~TaskFunc() {}

    public:
        int64_t expire_;               // 过期时间
        std::function<void()> func_;    // 执行函数
    };

    typedef std::shared_ptr<TaskFunc> TaskFuncPtr;

private:
    std::mutex poolMtx_;                // 启停保护
    std::condition_variable poolCond_;  // 启停通知
    std::atomic_bool isStart_;          // 线程池启动标识

    std::atomic_size_t poolNum_;        // 线程数量
    std::atomic_size_t activeNum_;      // 活跃线程数量

    std::vector<std::thread> vThreads_;     // 线程池中的线程
    SZ_ThreadQueue<TaskFuncPtr> queTasks_;      // 任务队列
};

template <typename Func, typename... Args>
auto SZ_ThreadPool::insert(Func &&func, Args &&...args)->std::future<decltype(func(args...))>
{
    return insert(0, func, args...);
}

template <typename Func, typename... Args>
auto SZ_ThreadPool::insert(int64_t timeout, Func &&func, Args &&...args)->std::future<decltype(func(args...))>
{
    using func_ret_type = decltype(func(args...));

    // 将任务函数的参数原封不动的绑定到任务函数上，并任务封包
    auto spTask = std::make_shared<std::packaged_task<func_ret_type()>>(std::bind(std::forward<Func>(func), std::forward<Args>(args)...));
    TaskFuncPtr ptr = std::make_shared<TaskFunc>(timeout <= 0 ? 0 : timeout + SZ_Common::nowms(), [spTask]() { (*spTask)(); });

    queTasks_.push(ptr);

    return spTask->get_future();
}

} // namespace SZ

#endif // SZLIBRARY_SZTHREADPOOL_H
