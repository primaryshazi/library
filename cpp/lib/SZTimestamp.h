#ifndef SZLIBRARY_SZTIMESTAMP_H
#define SZLIBRARY_SZTIMESTAMP_H

#include "SZCommon.h"

namespace SZ
{

class SZ_Timestamp
{
public:
    SZ_Timestamp();

    SZ_Timestamp(int64_t micro);

    SZ_Timestamp(int64_t second, int64_t micro);

    ~SZ_Timestamp();

    /**
     * @brief 获取秒数
     *
     * @return int64_t
     */
    int64_t seconds() const;

    /**
     * @brief 获取毫秒数
     *
     * @return int64_t
     */
    int64_t millis() const;

    /**
     * @brief 获取微秒数
     *
     * @return int64_t
     */
    int64_t mircos() const;

    /**
     * @brief 秒数格式化
     *
     * @return std::string
     */
    std::string secondFormat() const;

    /**
     * @brief 毫秒数格式化
     *
     * @return std::string
     */
    std::string microFormat() const;

    /**
     * @brief 添加时间
     *
     * @param ts
     * @return SZ_Timestamp
     */
    SZ_Timestamp additon(const SZ_Timestamp &ts);

    /**
     * @brief 减少时间
     *
     * @param ts
     * @return SZ_Timestamp
     */
    SZ_Timestamp subtract(const SZ_Timestamp &ts);

    /**
     * @brief 时间之差
     *
     * @param ts
     * @return int64_t
     */
    int64_t difference(const SZ_Timestamp &ts) const;

    /**
     * @brief 获取当前时间
     *
     * @return SZ_Timestamp
     */
    static SZ_Timestamp current();

    bool operator <(const SZ_Timestamp &ts) { return this->microSinceEpoch_ < ts.microSinceEpoch_; }

    bool operator >(const SZ_Timestamp &ts) { return this->microSinceEpoch_ > ts.microSinceEpoch_; }

    bool operator<=(const SZ_Timestamp &ts) { return this->microSinceEpoch_ <= ts.microSinceEpoch_; }

    bool operator>=(const SZ_Timestamp &ts) { return this->microSinceEpoch_ >= ts.microSinceEpoch_; }

    bool operator==(const SZ_Timestamp &ts) { return this->microSinceEpoch_ == ts.microSinceEpoch_; }

    SZ_Timestamp operator+=(const SZ_Timestamp &ts) { this->microSinceEpoch_ += ts.microSinceEpoch_; return *this; }

    SZ_Timestamp operator-=(const SZ_Timestamp &ts) { this->microSinceEpoch_ -= ts.microSinceEpoch_; return *this; }

private:
    int64_t microSinceEpoch_;   // 微秒
};

} // namespace SZ

#endif  // SZLIBRARY_SZTIMESTAMP_H
