#ifndef SZLIBRARY_SZINI_H
#define SZLIBRARY_SZINI_H

#include "SZCommon.h"
#include "SZException.h"
#include "SZUncopy.h"

#include <vector>
#include <string>
#include <map>

namespace SZ
{

class SZ_Ini_Exception : public SZ_Exception
{
public:
    SZ_Ini_Exception(const std::string &sErr) : SZ_Exception("SZ_INI", sErr) {}
    virtual ~SZ_Ini_Exception() noexcept {}
};

/**
 * @brief 读写.ini文件
 */
class SZ_Ini : public SZ_Uncopy
{
public:
    /**
     * @brief 单项配置
     */
    struct SZ_IniItem
    {
        std::string section;
        std::string key;
        std::string value;
        std::string comment;

        friend bool operator==(const SZ_IniItem& one, const SZ_IniItem& two);

        friend bool operator>(const SZ_IniItem& one, const SZ_IniItem& two);

        friend bool operator<(const SZ_IniItem& one, const SZ_IniItem& two);

        friend std::ostream &operator<<(std::ostream &os, const SZ_IniItem &item);
    };

public:
    SZ_Ini() {}

    SZ_Ini(const std::string &sFile) : sFile_(sFile) {}

    ~SZ_Ini() {}

    /**
     * @brief 参数为空，返回原有路径
     *        参数不为空，返回原有路径，置为新路径
     *
     * @param sFile
     * @return std::string
     */
    std::string file(const std::string &sFile = "");

    /**
     * @brief 读取.ini数据
     *
     * @param sFile
     */
    void read(const std::string& sFile = "");

    /**
     * @brief 数据写入.ini
     *
     * @param sFile
     */
    void write(const std::string& sFile = "");

    /**
     * @brief 清除所有数据
     */
    void clear();

    /**
     * @brief 获取所有的section
     *
     * @return std::vector<std::string>
     */
    std::vector<std::string> sections() const;

    /**
     * @brief 获取指定section下所有的key
     *
     * @param sSection
     * @return std::vector<std::string>
     */
    std::vector<std::string> keys(const std::string& sSection) const;

    /**
     * @brief 获取section下所有配置
     *
     * @param sSection
     * @return std::map<std::string, std::string>
     */
    std::map<std::string, std::string> readValueMap(const std::string &sSection) const;

    /**
     * @brief 设置指定的value
     *
     * @param sSection
     * @param sKey
     * @param sValue
     * @return int
     */
    int writeValue(const std::string& sSection, const std::string& sKey, const std::string& sValue);

    /**
     * @brief 获取指定的value
     *
     * @param sSection
     * @param sKey
     * @param sDefault
     * @return int
     */
    std::string readValue(const std::string& sSection, const std::string& sKey, const std::string &sDefault = "") const;

    /**
     * @brief 设置指定的配置项
     *
     * @param item
     * @return int
     */
    int writeItem(const SZ_IniItem& item);

    /**
     * @brief 获取指定的配置项
     *
     * @param sSection
     * @param sKey
     * @param defaultItem
     * @return SZ_IniItem
     */
    SZ_IniItem readItem(const std::string& sSection, const std::string& sKey, const SZ_IniItem &defaultItem = {}) const;

    /**
     * @brief 添加配置项
     *
     * @param item
     * @return int
     */
    int insert(const SZ_IniItem &item);

    /**
     * @brief 添加配置项
     *
     * @param sSection
     * @param sKey
     * @param sValue
     * @param sComment
     * @return
     */
    int insert(const std::string &sSection, const std::string &sKey, const std::string &sValue, const std::string &sComment = "");

    /**
     * @brief 删除section
     *
     * @param sSection
     */
    int erase(const std::string& sSection);

    /**
     * @brief 删除key
     *
     * @param sSection
     * @param sKey
     * @return int
     */
    int erase(const std::string &sSection, const std::string &sKey);

private:
    typedef std::map<std::string, SZ_IniItem> MapKey;
    typedef std::map<std::string, MapKey> MapItem;
    typedef std::pair<std::string, std::string> PairSecKey;
    typedef std::vector<PairSecKey> VecItem;

    /**
     * @brief 配置项是否存在
     *
     * @param sSection
     * @return bool
     */
    bool isExist(const std::string &sSection) const;

    /**
     * @brief 配置项是否存在
     *
     * @param sSection
     * @param sKey
     * @return bool
     */
    bool isExist(const std::string &sSection, const std::string &sKey) const;

    /**
     * @brief 解析.ini配置文件
     *
     * @param vecLine
     * @return int
     */
    int parse(const std::vector<std::string> &vecLine);

    /**
     * @brief 处理储存配置项
     *
     * @param item
     */
    void dealItem(const SZ_IniItem &item);

private:
    MapItem mapItem_; // 储存所有.ini文件数据，便于读取
    VecItem vecItem_; // 储存所有.ini文件数据，便于写入

    std::string sFile_;             // 配置.ini文件路径
};

} // namespace SZ

#endif // SZLIBRARY_SZINI_H
