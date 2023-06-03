#include "SZTimestamp.h"

namespace SZ
{

SZ_Timestamp::SZ_Timestamp() : microSinceEpoch_(0)
{
}

SZ_Timestamp::SZ_Timestamp(int64_t micro)
{
    microSinceEpoch_ = micro;
    if (microSinceEpoch_ < 0)
    {
        microSinceEpoch_ = 0;
    }
}

SZ_Timestamp::SZ_Timestamp(int64_t second, int64_t micro)
{
    microSinceEpoch_ = second * SZ_Common::MILLION_MULTIPLE + micro;
    if (microSinceEpoch_ < 0)
    {
        microSinceEpoch_ = 0;
    }
}

SZ_Timestamp::~SZ_Timestamp()
{
}

int64_t SZ_Timestamp::seconds() const
{
    return microSinceEpoch_ / SZ_Common::MILLION_MULTIPLE;
}

int64_t SZ_Timestamp::millis() const
{
    return microSinceEpoch_ / SZ_Common::THOUSAND_MULTIPLE;
}

int64_t SZ_Timestamp::mircos() const
{
    return microSinceEpoch_;
}

std::string SZ_Timestamp::secondFormat() const
{
    tm tmInfo{};
    SZ_Common::time2tm(microSinceEpoch_ / SZ_Common::MILLION_MULTIPLE, tmInfo);
    char buffer[64] = "";

    snprintf(buffer, sizeof(buffer), "%4d-%02d-%02d %02d:%02d:%02d", tmInfo.tm_year + 1900, tmInfo.tm_mon + 1, tmInfo.tm_mday,
        tmInfo.tm_hour, tmInfo.tm_min, tmInfo.tm_sec);
    return buffer;
}

std::string SZ_Timestamp::microFormat() const
{
    tm tmInfo{};
    SZ_Common::time2tm(microSinceEpoch_ / SZ_Common::MILLION_MULTIPLE, tmInfo);
    char buffer[64] = "";

    snprintf(buffer, sizeof(buffer), "%4d-%02d-%02d %02d:%02d:%02d.%06ld", tmInfo.tm_year + 1900, tmInfo.tm_mon + 1, tmInfo.tm_mday,
             tmInfo.tm_hour, tmInfo.tm_min, tmInfo.tm_sec, microSinceEpoch_ % SZ_Common::MILLION_MULTIPLE);
    return buffer;
}

SZ_Timestamp SZ_Timestamp::additon(const SZ_Timestamp &ts)
{
    return SZ_Timestamp(this->microSinceEpoch_ + ts.microSinceEpoch_);
}

SZ_Timestamp SZ_Timestamp::subtract(const SZ_Timestamp &ts)
{
    return SZ_Timestamp(this->microSinceEpoch_ - ts.microSinceEpoch_);
}

int64_t SZ_Timestamp::difference(const SZ_Timestamp &ts) const
{
    return microSinceEpoch_ - ts.microSinceEpoch_;
}

SZ_Timestamp SZ_Timestamp::current()
{
    timeval tv{};
    ::gettimeofday(&tv, nullptr);
    return SZ_Timestamp(tv.tv_sec, tv.tv_usec);
}

} // namespace SZ
