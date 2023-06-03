#ifndef SZLIBRARY_SZCOMMON_H
#define SZLIBRARY_SZCOMMON_H

#include <algorithm>
#include <array>
#include <initializer_list>
#include <vector>
#include <list>
#include <deque>
#include <set>
#include <unordered_set>
#include <map>
#include <unordered_map>
#include <thread>
#include <sstream>
#include <string>
#include <cctype>
#include <cmath>
#include <cstring>
#include <cerrno>
#include <unistd.h>
#include <ctime>
#include <sys/time.h>
#include <linux/limits.h>
#include <sys/types.h>

#define SZ_FILE_NAME(x) (strrchr(x, '/') ? strrchr(x, '/') + 1 : x)
#define SZ_FILE_FUNC_LINE "[" << SZ_FILE_NAME(__FILE__) << "::" << __FUNCTION__ << "::" << __LINE__ << "]"

namespace SZ
{

class SZ_Common
{
public:
    static const float EPSILON_FLOAT;                   // float精度，默认6位
    static const double EPSILON_DOUBLE;                 // double精度，默认6位
    static const long double EPSILON_LONG_DOUBLE;       // long double精度，默认10位

    static const time_t SECOND_AT_ONE_DAY;              // 一天秒数
    static const time_t SECOND_AT_ONE_HOUR;             // 一时秒数
    static const time_t SECOND_AT_ONE_MINUTE;           // 一分秒数
    static const time_t HOUR_AT_ONE_DAY;                // 一天时数
    static const time_t MINUTE_AT_ONE_DAY;              // 一天分数
    static const time_t MINUTE_AT_ONE_HOUR;             // 一时分数

    static const int64_t TEN_MULTIPLE;                  // 十倍
    static const int64_t HUNDRED_MULTIPLE;              // 百倍
    static const int64_t THOUSAND_MULTIPLE;             // 千倍
    static const int64_t MYRIAD_MULTIPLE;               // 万倍
    static const int64_t MILLION_MULTIPLE;              // 百万倍
    static const int64_t BILLION_MULTIPLE;              // 十亿倍

    static const int64_t PER_K;                         // 1K
    static const int64_t PER_M;                         // 1M
    static const int64_t PER_G;                         // 1G

    class SZ_TimezoneHelper
    {
    public:
        SZ_TimezoneHelper();

        static std::string timezone_local;
        static int64_t timezone_diff_secs;
    };

    static SZ_TimezoneHelper _TimeZoneHelper;

    /**
     * @brief 时间转换为时间结构体
     *
     * @param tt
     * @param stm
     */
    static void time2tm(const time_t &tt, struct tm &stm);

    /**
     * @brief 时间结构体体转时间
     *
     * @param stm
     * @param tt
     */
    static void tm2time(struct tm &stm, time_t &tt);

    /**
     * @brief 字符串转换为时间结构体
     *
     * @param sString
     * @param sFormat
     * @param stm
     * @return int
     */
    static int str2tm(const std::string &sString, const std::string &sFormat, struct tm &stm);

    /**
     * @brief 字符串转换为时间
     *
     * @param sString
     * @param sFormat
     * @return time_t
     */
    static time_t str2time(const std::string &sString, const std::string &sFormat = "%Y%m%d%H%M%S");

    /**
     * @brief 时间转为字符串
     *
     * @param tt
     * @param sFormat
     * @return std::string
     */
    static std::string time2str(const time_t &tt, const std::string &sFormat = "%Y%m%d%H%M%S");

    /**
     * @brief 时间结构体转换为字符串
     *
     * @param stm
     * @param sFormat
     * @return std::string
     */
    static std::string tm2str(const struct tm &stm, const std::string &sFormat = "%Y%m%d%H%M%S");

    /**
     * @brief 当前秒时间字符串
     *
     * @param sFormat
     * @return std::string
     */
    static std::string now2str(const std::string &sFormat = "%Y%m%d%H%M%S");

    /**
     * @brief 当前毫秒时间字符串
     *
     * @return std::string
     */
    static std::string now2msstr();

    /**
     * @brief 当前日期时间串
     *
     * @return std::string
     */
    static std::string nowdate2str();

    /**
     * @brief 当前时间串
     *
     * @return std::string
     */
    static std::string nowtime2str();

    /**
     * @brief 获取当前毫秒数
     *
     * @return int64_t
     */
    static int64_t nowms();

    /**
     * @brief 获取当前微妙数
     *
     * @return int64_t
     */
    static int64_t nowus();

    /**
     * @brief 获取下一天日期
     *
     * @param sDate %Y%m%d
     * @return std::string
     */
    static std::string nextDate(const std::string &sDate);

    /**
     * @brief 获取上一天日期
     *
     * @param sDate %Y%m%d
     * @return std::string
     */
    static std::string prevDate(const std::string &sDate);

    /**
     * @brief 获取上一天日期
     *
     * @param iDate %Y%m%d
     * @return int
     */
    static int nextDate(int iDate);

    /**
     * @brief 获取下一天日期
     *
     * @param iDate %Y%m%d
     * @return int
     */
    static int prevDate(int iDate);

    /**
     * @brief 获取下一月份
     *
     * @param sMonth %Y%m%d
     * @return std::string
     */
    static std::string nextMonth(const std::string &sMonth);

    /**
     * @brief 获取上一月份
     *
     * @param sDate %Y%m%d
     * @return std::string
     */
    static std::string prevMonth(const std::string &sMonth);

    /**
     * @brief 获取下一年份
     *
     * @param sYear
     * @return std::string
     */
    static std::string nextYear(const std::string &sYear);

    /**
     * @brief 获取上一年份
     *
     * @param sYear
     * @return std::string
     */
    static std::string prevYear(const std::string &sYear);

    /**
     * @brief 睡眠秒数
     *
     * @param sec
     */
    static void sleep(uint32_t sec);

    /**
     * @brief 睡眠毫秒
     *
     * @param ms
     */
    static void msleep(uint32_t ms);

    /**
     * @brief 比较浮点数是否相等
     *
     * @param x
     * @param y
     * @param epsilon
     * @return bool
     */
    static bool equal(float x, float y, float epsilon = EPSILON_FLOAT);

    static bool equal(double x, double y, double epsilon = EPSILON_DOUBLE);

    static bool equal(long double x, long double y, long double epsilon = EPSILON_LONG_DOUBLE);

    /**
     * @brief 依据线程ID生成随机数
     *
     * @return uint32_t
     */
    static int rand_thread();

    /**
     * @brief 从source左端中移除target中存在的字符
     *
     * @param source
     * @param str
     * @param isEntire true：删除target字符串；false：删除target每个字符
     * @return std::string
     */
    static std::string left_trim(const std::string &source, const std::string &target = " \r\n\t", bool isEntire = false);

    /**
     * @brief 从source右端中移除target中存在的字符
     *
     * @param source
     * @param str
     * @param isEntire true：删除target字符串；false：删除target每个字符
     * @return std::string
     */
    static std::string right_trim(const std::string &source, const std::string &target = " \r\n\t", bool isEntire = false);

    /**
     * @brief 从source两端中移除target中存在的字符
     *
     * @param source
     * @param str
     * @param isEntire true：删除target字符串；false：删除target每个字符
     * @return std::string
     */
    static std::string trim(const std::string &source, const std::string &target = " \r\n\t", bool isEntire = false);

    /**
     * @brief 字符串转换为小写
     *
     * @param source
     * @return std::string
     */
    static std::string toLower(const std::string &source);

    /**
     * @brief 字符串转换为大写
     *
     * @param source
     * @return std::string
     */
    static std::string toUpper(const std::string &source);

    /**
     * @brief 字符串是否全为十进制数字
     *
     * @param source
     * @return bool
     */
    static bool isDigit(const std::string &source);

    /**
     * @brief 字符串是否全为十六进制数字
     *
     * @param source
     * @return bool
     */
    static bool isXDigit(const std::string &source);

    /**
     * @brief 判断字符串是否全为字母
     *
     * @param source
     * @return bool
     */
    static bool isAlpha(const std::string &source);

    /**
     * @brief 判断字符串是否全为字母或数字
     *
     * @param source
     * @return bool
     */
    static bool isAlnum(const std::string &source);

    /**
     * @brief 分割字符串
     *
     * @param str
     * @param split
     * @param withEmpty
     * @return std::string
     */
    static std::vector<std::string> splitString(const std::string &str, const std::string &split, bool withEmpty = false);

    /**
     * @brief 替换字符串
     *
     * @param str
     * @param src
     * @param dest
     * @return std::string
     */
    static std::string replaceString(const std::string &str, const std::string &src, const std::string &dest);

    /**
     * @brief 返回系统错误
     *
     * @return std::string
     */
    static std::string error();

    /**
     * @brief 返回执行程序的路径
     *
     * @return std::string
     */
    static std::string selfPath();

    /**
     * @brief 转换字符串
     *
     * @tparam T
     * @param val
     * @return std::string
     */
    template <typename T>
    static std::string toString(const T &val);

    template <typename X, typename Y>
    static std::string toString(const std::pair<X, Y> &p);

    template <typename Iter>
    static std::string toString(const Iter &beg, const Iter &end);

    template <typename T, size_t U>
    static std::string toString(const std::array<T, U> &a);

    template <typename T>
    static std::string toString(const std::initializer_list<T> &l);

    template <typename T>
    static std::string toString(const std::vector<T> &v);

    template <typename T>
    static std::string toString(const std::list<T> &l);

    template <typename T>
    static std::string toString(const std::deque<T> &d);

    template <typename T>
    static std::string toString(const std::set<T> &s);

    template <typename T>
    static std::string toString(const std::unordered_set<T> &s);

    template <typename K, typename V>
    static std::string toString(const std::map<K, V> &m);

    template <typename K, typename V>
    static std::string toString(const std::unordered_map<K, V> &m);

    /**
     * @brief 字符串转换
     *
     * @tparam T
     * @param str
     * @return T
     */
    template <typename T>
    static T stringTo(const std::string &str);

private:
    /**
     * @brief 转换字符串
     *
     * @tparam Container
     * @param con
     * @param str
     */
    template <typename Container>
    static void toString(const Container &con, std::string &str);

    /**
     * @brief 转换字符串
     *
     * @tparam Iter
     * @param beg
     * @param end
     * @param str
     */
    template <typename Iter>
    static void toString(const Iter &beg, const Iter &end, std::string &str);
};

template <>
std::string SZ_Common::toString(const char &val);

template <>
std::string SZ_Common::toString(const unsigned char &val);

template <>
std::string SZ_Common::toString(const int &val);

template <>
std::string SZ_Common::toString(const unsigned &val);

template <>
std::string SZ_Common::toString(const long &val);

template <>
std::string SZ_Common::toString(const unsigned long &val);

template <>
std::string SZ_Common::toString(const long long &val);

template <>
std::string SZ_Common::toString(const unsigned long long &val);

template <>
std::string SZ_Common::toString(const float &val);

template <>
std::string SZ_Common::toString(const double &val);

template <>
std::string SZ_Common::toString(const long double &val);

template <>
std::string SZ_Common::toString(const std::string &val);

template <typename T>
std::string SZ_Common::toString(const T &val)
{
    std::ostringstream ss;
    ss << val;
    return ss.str();
}

template <typename X, typename Y>
std::string SZ_Common::toString(const std::pair<X, Y> &p)
{
    std::string str;

    str += "[";
    str += SZ_Common::toString(p.first);
    str += "]=[";
    str += SZ_Common::toString(p.second);
    str += "]";

    return str;
}

template <typename Iter>
std::string SZ_Common::toString(const Iter &beg, const Iter &end)
{
    std::string str;
    SZ_Common::toString(beg, end, str);
    return str;
}

template <typename T, size_t U>
std::string SZ_Common::toString(const std::array<T, U> &a)
{
    std::string str;
    SZ_Common::toString(a, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::initializer_list<T> &l)
{
    std::string str;
    SZ_Common::toString(l, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::vector<T> &v)
{
    std::string str;
    SZ_Common::toString(v, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::list<T> &l)
{
    std::string str;
    SZ_Common::toString(l, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::deque<T> &d)
{
    std::string str;
    SZ_Common::toString(d, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::set<T> &s)
{
    std::string str;
    SZ_Common::toString(s, str);
    return str;
}

template <typename T>
std::string SZ_Common::toString(const std::unordered_set<T> &s)
{
    std::string str;
    SZ_Common::toString(s, str);
    return str;
}

template <typename K, typename V>
std::string SZ_Common::toString(const std::map<K, V> &m)
{
    std::string str;
    SZ_Common::toString(m, str);
    return str;
}

template <typename K, typename V>
std::string SZ_Common::toString(const std::unordered_map<K, V> &m)
{
    std::string str;
    SZ_Common::toString(m, str);
    return str;
}

template <typename Container>
void SZ_Common::toString(const Container &con, std::string &str)
{
    bool isFirst = true;
    for (auto &element : con)
    {
        if (isFirst)
        {
            isFirst = false;
        }
        else
        {
            str += " ";
        }
        str += SZ_Common::toString(element);
    }
}

template <typename Iter>
void SZ_Common::toString(const Iter &beg, const Iter &end, std::string &str)
{
    for (auto it = beg; it != end; ++it)
    {
        if (it != beg)
        {
            str += " ";
        }
        str += SZ_Common::toString(*it);
    }
}

namespace CM
{

template<typename T>
struct stringToX
{
    T operator()(const std::string &str)
    {
        std::string s = "0";
        if(!str.empty())
        {
            s = str;
        }

        std::istringstream ss(s);
        T val;
        ss >> val;

        return val;
    }
};

template <>
struct stringToX<int>
{
    int operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return static_cast<int>(std::strtol(str.c_str(), nullptr, radix));
        }
        return 0;
    }
};

template <>
struct stringToX<unsigned>
{
    unsigned operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return static_cast<unsigned>(std::strtoul(str.c_str(), nullptr, radix));
        }
        return 0;
    }
};

template <>
struct stringToX<long>
{
    long operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return std::strtol(str.c_str(), nullptr, radix);
        }
        return 0;
    }
};

template <>
struct stringToX<unsigned long>
{
    unsigned long operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return std::strtoul(str.c_str(), nullptr, radix);
        }
        return 0;
    }
};

template <>
struct stringToX<long long>
{
    long long operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return std::strtoll(str.c_str(), nullptr, radix);
        }
        return 0;
    }
};

template <>
struct stringToX<unsigned long long>
{
    unsigned long long operator()(const std::string &str)
    {
        if (!str.empty())
        {
            int radix = (str.find("0x") == 0 ? 16 : 10);
            return std::strtoull(str.c_str(), nullptr, radix);
        }
        return 0;
    }
};

template <>
struct stringToX<float>
{
    float operator()(const std::string &str)
    {
        if (!str.empty())
        {
            return std::strtof(str.c_str(), nullptr);
        }
        return 0;
    }
};

template <>
struct stringToX<double>
{
    double operator()(const std::string &str)
    {
        if (!str.empty())
        {
            return std::strtod(str.c_str(), nullptr);
        }
        return 0;
    }
};

template <>
struct stringToX<long double>
{
    long double operator()(const std::string &str)
    {
        if (!str.empty())
        {
            return std::strtold(str.c_str(), nullptr);
        }
        return 0;
    }
};

template <>
struct stringToX<std::string>
{
    std::string operator()(const std::string &str)
    {
        return str;
    }
};

template<typename T>
struct stringToY
{
    T operator()(const std::string &str)
    {
        std::istringstream ss(str);
        T val;
        ss >> val;

        return val;
    }
};

} // namespace CM

template <typename T>
T SZ_Common::stringTo(const std::string &str)
{
    using stringto_type = typename std::conditional<std::is_arithmetic<T>::value, CM::stringToX<T>, CM::stringToY<T>>::type;
    return stringto_type()(str);
}

} // namespace SZ

#endif // SZLIBRARY_SZCOMMON_H
