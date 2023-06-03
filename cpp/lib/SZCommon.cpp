#include "SZCommon.h"
#include "SZThread.h"

namespace SZ
{

const float SZ_Common::EPSILON_FLOAT                = 0.000001f;
const double SZ_Common::EPSILON_DOUBLE              = 0.000001;
const long double SZ_Common::EPSILON_LONG_DOUBLE    = 0.0000000001;

const time_t SZ_Common::SECOND_AT_ONE_DAY       = 60 * 60 * 24;
const time_t SZ_Common::SECOND_AT_ONE_HOUR      = 60 * 60;
const time_t SZ_Common::SECOND_AT_ONE_MINUTE    = 60;
const time_t SZ_Common::HOUR_AT_ONE_DAY         = 24;
const time_t SZ_Common::MINUTE_AT_ONE_DAY       = 60 * 24;
const time_t SZ_Common::MINUTE_AT_ONE_HOUR      = 60;

const int64_t SZ_Common::TEN_MULTIPLE       = 10;
const int64_t SZ_Common::HUNDRED_MULTIPLE   = 100;
const int64_t SZ_Common::THOUSAND_MULTIPLE  = 1000;
const int64_t SZ_Common::MYRIAD_MULTIPLE    = 10000;
const int64_t SZ_Common::MILLION_MULTIPLE   = 1000000;
const int64_t SZ_Common::BILLION_MULTIPLE   = 1000000000;

const int64_t SZ_Common::PER_K = 1024;
const int64_t SZ_Common::PER_M = 1024 * 1024;
const int64_t SZ_Common::PER_G = 1024 * 1024 * 1024;

SZ_Common::SZ_TimezoneHelper::SZ_TimezoneHelper()
{
    struct tm timeinfo;
    time_t secs, local_secs, gmt_secs;

    // UTC时间戳
    time(&secs);

    //带时区时间
    ::localtime_r(&secs, &timeinfo);
    local_secs = ::mktime(&timeinfo);
    SZ_TimezoneHelper::timezone_local = std::string(timeinfo.tm_zone);

    //不带时区时间
    ::gmtime_r(&secs, &timeinfo);

    gmt_secs = ::mktime(&timeinfo);
    SZ_TimezoneHelper::timezone_diff_secs = local_secs - gmt_secs;
}

std::string SZ_Common::SZ_TimezoneHelper::timezone_local;

int64_t SZ_Common::SZ_TimezoneHelper::timezone_diff_secs = 0;

SZ_Common::SZ_TimezoneHelper SZ_Common::_TimeZoneHelper;

void SZ_Common::time2tm(const time_t &tt, struct tm &stm)
{
    time_t localt = tt + SZ_Common::SZ_TimezoneHelper::timezone_diff_secs;
    ::gmtime_r(&localt, &stm);

    static std::string local_timezone = SZ_TimezoneHelper::timezone_local;
    stm.tm_zone = const_cast<char *>(local_timezone.c_str());
    stm.tm_gmtoff = SZ_TimezoneHelper::timezone_diff_secs;
}

void SZ_Common::tm2time(struct tm &stm, time_t &tt)
{
    tt = ::timegm(&stm) - SZ_Common::SZ_TimezoneHelper::timezone_diff_secs;
}

int SZ_Common::str2tm(const std::string &sString, const std::string &sFormat, struct tm &stm)
{
    char *p = ::strptime(sString.c_str(), sFormat.c_str(), &stm);
    return (p != nullptr) ? 0 : -1;
}

time_t SZ_Common::str2time(const std::string &sString, const std::string &sFormat)
{
    struct tm stm{};
    if (0 == str2tm(sString, sFormat, stm))
    {
        //注意这里没有直接用mktime, mktime会访问时区文件, 会巨慢!
        return ::timegm(&stm) - SZ_Common::SZ_TimezoneHelper::timezone_diff_secs;
    }
    return 0;
}

std::string SZ_Common::time2str(const time_t &tt, const std::string &sFormat)
{
    struct tm stm{};
    SZ_Common::time2tm(tt, stm);
    return SZ_Common::tm2str(stm, sFormat);
}

std::string SZ_Common::tm2str(const struct tm &stm, const std::string &sFormat)
{
    char sTimeString[255] = "\0";
    ::strftime(sTimeString, sizeof(sTimeString), sFormat.c_str(), &stm);
    return std::string(sTimeString);
}

std::string SZ_Common::now2str(const std::string &sFormat)
{
    time_t tt = time(nullptr);
    return SZ_Common::time2str(tt, sFormat.c_str());
}

std::string SZ_Common::now2msstr()
{
    time_t tt = time(nullptr);
    int64_t duration_in_ms = SZ_Common::nowms();

    struct tm stm{};
    ::localtime_r(&tt, &stm);

    std::string s;
    s.resize(64);
    const char *szFormat = "%04d-%02d-%02d %02d:%02d:%02d.%03ld";
    size_t n = snprintf(&s[0], s.size(), szFormat, stm.tm_year + 1900, stm.tm_mon + 1, stm.tm_mday, stm.tm_hour, stm.tm_min, stm.tm_sec, duration_in_ms % 1000);
    s.resize(n);
    return s;
}

std::string SZ_Common::nowdate2str()
{
    return SZ_Common::now2str("%Y%m%d");
}

std::string SZ_Common::nowtime2str()
{
    return SZ_Common::now2str("%H%M%S");
}

int64_t SZ_Common::nowms()
{
    struct timeval tv {};
    ::gettimeofday(&tv, nullptr);
    return static_cast<int64_t>(tv.tv_sec) * 1000 + tv.tv_usec / 1000;
}

int64_t SZ_Common::nowus()
{
    struct timeval tv {};
    ::gettimeofday(&tv, nullptr);
    return static_cast<int64_t>(tv.tv_sec) * 1000000 + tv.tv_usec;
}

std::string SZ_Common::nextDate(const std::string &sDate)
{
    time_t tomorrow = SZ_Common::str2time(sDate + "000000", "%Y%m%d%H%M%S") + SZ_Common::SECOND_AT_ONE_DAY;
    return SZ_Common::time2str(tomorrow, "%Y%m%d");
}

std::string SZ_Common::prevDate(const std::string &sDate)
{
    time_t tomorrow = SZ_Common::str2time(sDate + "000000", "%Y%m%d%H%M%S") - SZ_Common::SECOND_AT_ONE_DAY;
    return SZ_Common::time2str(tomorrow, "%Y%m%d");
}

int SZ_Common::nextDate(int iDate)
{
    return SZ_Common::stringTo<int>(SZ_Common::nextDate(SZ_Common::toString(iDate)));
}

int SZ_Common::prevDate(int iDate)
{
    return SZ_Common::stringTo<int>(SZ_Common::prevDate(SZ_Common::toString(iDate)));
}

std::string SZ_Common::nextMonth(const std::string &sMonth)
{
    if (sMonth.length() != 6)
    {
        return "197001";
    }
    int year = SZ_Common::stringTo<int>(sMonth.substr(0, 4));
    int month = SZ_Common::stringTo<int>(sMonth.substr(4, 2));

    int monthNew = month + 1;
    int yearNew = year;
    if (monthNew == 13)
    {
        monthNew = 1;
        yearNew = year + 1;
    }

    yearNew = (yearNew >= 1970 && yearNew <= 9999) ? yearNew : 1970;
    monthNew = (monthNew >= 1 && monthNew <= 12) ? monthNew : 0;

    char szMonth[4] = "\0";

    snprintf(szMonth, sizeof(szMonth) - 1, "%02d", monthNew);

    return SZ_Common::toString(yearNew) + szMonth;
}

std::string SZ_Common::prevMonth(const std::string &sMonth)
{
    if (sMonth.length() != 6)
    {
        return "197001";
    }
    int year = SZ_Common::stringTo<int>(sMonth.substr(0, 4));
    int month = SZ_Common::stringTo<int>(sMonth.substr(4, 2));

    int monthNew = month - 1;
    int yearNew = year;
    if (monthNew == 0)
    {
        monthNew = 12;
        yearNew = year - 1;
    }
    yearNew = (yearNew >= 1970 && yearNew <= 9999) ? yearNew : 1970;
    monthNew = (monthNew >= 1 && monthNew <= 12) ? monthNew : 0;

    char szMonth[4] = { 0 };

    snprintf(szMonth, sizeof(szMonth) - 1, "%02d", monthNew);

    return SZ_Common::toString(yearNew) + szMonth;
}

std::string SZ_Common::nextYear(const std::string &sYear)
{
    if (sYear.length() != 4)
    {
        return "1970";
    }
    int year = SZ_Common::stringTo<int>(sYear.substr(0, 4));
    int yearNew = year + 1;

    yearNew = (yearNew >= 1970 && yearNew <= 9999) ? yearNew : 1970;

    return SZ_Common::toString(yearNew);
}

std::string SZ_Common::prevYear(const std::string &sYear)
{
    if (sYear.length() != 4)
    {
        return "1970";
    }
    int year = SZ_Common::stringTo<int>(sYear.substr(0, 4));
    int yearNew = year - 1;

    yearNew = (yearNew >= 1970 && yearNew <= 9999) ? yearNew : 1970;

    return SZ_Common::toString(yearNew);
}

void SZ_Common::sleep(uint32_t sec)
{
    std::this_thread::sleep_for(std::chrono::seconds(sec));
}

void SZ_Common::msleep(uint32_t ms)
{
    std::this_thread::sleep_for(std::chrono::milliseconds(ms));
}

bool SZ_Common::equal(float x, float y, float epsilon)
{
    return std::fabs(x - y) < epsilon;
}

bool SZ_Common::equal(double x, double y, double epsilon)
{
    return std::fabs(x - y) < epsilon;
}

bool SZ_Common::equal(long double x, long double y, long double epsilon)
{
    return std::fabs(x - y) < epsilon;
}

int SZ_Common::rand_thread()
{
    thread_local unsigned int seed = SZ_ThisThread::tid();
    return ::rand_r(&seed);
}

std::string SZ_Common::left_trim(const std::string &source, const std::string &target, bool isEntire)
{
    if (source.empty() || target.empty())
    {
        return source;
    }

    if (isEntire)
    {
        if (source.length() < target.length())
        {
            return source;
        }
        // source左端字符串与target相等则截取之后
        if (source.compare(0, target.length(), target) == 0)
        {
            return source.substr(target.length());
        }
    }

    size_t pos = 0;
    while (pos < source.length())
    {
        // 在target中查找source中的每个字符，字符找不到则立即退出
        if (target.find_first_of(source[pos]) == std::string::npos)
        {
            break;
        }
        ++pos;
    }

    // 未删除字符则返回源字符串，否则返回之后
    return (0 == pos ? source : source.substr(pos));
}

std::string SZ_Common::right_trim(const std::string &source, const std::string &target, bool isEntire)
{
    if (source.empty() || target.empty())
    {
        return source;
    }

    if (isEntire)
    {
        if (source.length() < target.length())
        {
            return source;
        }
        if (source.compare(source.length() - target.length(), std::string::npos, target) == 0)
        {
            return source.substr(0, source.length() - target.length());
        }
    }

    size_t pos = source.length();
    while (pos > 0)
    {
        if (target.find_first_of(source[pos - 1]) == std::string::npos)
        {
            break;
        }
        --pos;
    }

    return (source.length() == pos ? source : source.substr(0, pos));
}

std::string SZ_Common::trim(const std::string &source, const std::string &target, bool isEntire)
{
    return right_trim(left_trim(source, target, isEntire), target, isEntire);
}

std::string SZ_Common::toLower(const std::string &source)
{
    std::string str = source;
    for (auto &c : str)
    {
        c = std::tolower(c);
    }
    return str;
}

std::string SZ_Common::toUpper(const std::string &source)
{
    std::string str = source;
    for (auto &c : str)
    {
        c = std::toupper(c);
    }
    return str;
}

bool SZ_Common::isDigit(const std::string &source)
{
    if (source.empty())
    {
        return false;
    }

    for (auto &c : source)
    {
        if (!std::isdigit(c))
        {
            return false;
        }
    }
    return true;
}

bool SZ_Common::isXDigit(const std::string &source)
{
    if (source.empty())
    {
        return false;
    }

    for (auto &c : source)
    {
        if (!std::isxdigit(c))
        {
            return false;
        }
    }
    return true;
}

bool SZ_Common::isAlpha(const std::string &source)
{
    if (source.empty())
    {
        return false;
    }

    for (auto &c : source)
    {
        if (!std::isalpha(c))
        {
            return false;
        }
    }
    return true;
}

bool SZ_Common::isAlnum(const std::string &source)
{
    if (source.empty())
    {
        return false;
    }

    for (auto &c : source)
    {
        if (!std::isalnum(c))
        {
            return false;
        }
    }
    return true;
}

std::vector<std::string> SZ_Common::splitString(const std::string &str, const std::string &split, bool withEmpty)
{
    std::vector<std::string> vStr;

    std::string::size_type start = 0;
    std::string::size_type pos = 0;

    while (true)
    {
        std::string s;
        pos = str.find_first_of(split, start);
        if (pos == std::string::npos)
        {
            if (start + 1 <= str.length())
            {
                s = str.substr(start);
            }
        }
        else if (pos == start)
        {
            s = "";
        }
        else
        {
            s = str.substr(start, pos - start);
            start = pos;
        }

        if (withEmpty || !s.empty())
        {
            vStr.push_back(std::move(s));
        }

        if (pos == std::string::npos)
        {
            break;
        }

        start++;
    }

    return vStr;
}

std::string SZ_Common::replaceString(const std::string &str, const std::string &src, const std::string &dest)
{
    if (src.empty())
    {
        return str;
    }

    std::string sResult = str;
    std::string::size_type pos = 0;

    while ((pos = sResult.find(src, pos)) != std::string::npos)
    {
        sResult.replace(pos, src.length(), dest);
        pos += dest.length();
    }

    return sResult;
}

std::string SZ_Common::error()
{
    return +"[" + SZ_Common::toString(errno) + "] " + SZ_Common::toString(strerror(errno));
}

std::string SZ_Common::selfPath()
{
    char path[PATH_MAX + 1] = "\0";
    int len = readlink("/proc/self/exe", path, sizeof(path));

    if (len <= 0)
    {
        return "./";
    }
    path[len] = '\0';

    return path;
}

template <>
std::string SZ_Common::toString(const char &val)
{
    char buf[2] = "\0";
    snprintf(buf, 2, "%c", val);
    return std::string(buf);
}

template <>
std::string SZ_Common::toString(const unsigned char &val)
{
    char buf[2] = "\0";
    snprintf(buf, 2, "%c", val);
    return std::string(buf);
}

template <>
std::string SZ_Common::toString(const int &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const unsigned &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const long &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const unsigned long &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const long long &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const unsigned long long &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const float &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const double &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const long double &val)
{
    return std::to_string(val);
}

template <>
std::string SZ_Common::toString(const std::string &val)
{
    return val;
}

} // namespace SZ
