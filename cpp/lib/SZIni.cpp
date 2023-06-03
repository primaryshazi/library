#include "SZIni.h"

#include <algorithm>
#include <fstream>
#include <utility>
#include <memory>

namespace SZ
{

bool operator==(const SZ_Ini::SZ_IniItem& one, const SZ_Ini::SZ_IniItem& two)
{
    return one.section == two.section && one.key == two.key;
}

bool operator >(const SZ_Ini::SZ_IniItem& one, const SZ_Ini::SZ_IniItem& two)
{
    if (one.section > two.section)
    {
        return true;
    }
    else if (one.section < two.section)
    {
        return false;
    }
    else
    {
        return one.key > two.key;
    }
}

bool operator <(const SZ_Ini::SZ_IniItem& one, const SZ_Ini::SZ_IniItem& two)
{
    if (one.section < two.section)
    {
        return true;
    }
    else if (one.section > two.section)
    {
        return false;
    }
    else
    {
        return one.key < two.key;
    }
}

std::ostream &operator<<(std::ostream &os, const SZ_Ini::SZ_IniItem &item)
{
    os << "{ \"" << item.section << "\", \"" << item.key << "\", \"" << item.value << "\", \"" << item.comment << "\" }";

    return os;
}

bool SZ_Ini::isExist(const std::string &sSection) const
{
    if (auto sit = mapItem_.find(sSection); sit == mapItem_.end())
    {
        return false;
    }

    return true;
}

bool SZ_Ini::isExist(const std::string &sSection, const std::string &sKey) const
{
    if (auto sit = mapItem_.find(sSection); sit != mapItem_.end())
    {
        if (auto kit = sit->second.find(sKey); kit == sit->second.end())
        {
            return false;
        }
    }
    else
    {
        return false;
    }

    return true;
}

int SZ_Ini::parse(const std::vector<std::string> &vecLine)
{
    std::string currentSection;     // 当前section
    std::string comment;            // 上部注释
    size_t squareBracketIndex = -1; // 中括号位置
    size_t equalIndex = -1;         // 等号位置
    size_t lineNum = 0;
    std::string sErr;

    for (const auto &strLine : vecLine)
    {
        SZ_IniItem item;

        lineNum++;
        std::string sLine = SZ_Common::trim(strLine);
        if (sLine.empty())
        {
            continue;
        }

        // 利用首字符判断该行内容
        switch (sLine.front())
        {
        case '[': // 解析section
            // 在该行中查找右括号的位置
            squareBracketIndex = sLine.find(']');
            // 找不到则报异常
            if (squareBracketIndex == std::string::npos)
            {
                sErr = " Lack of close bracket ";
                break;
            }

            // 提取并处理section
            currentSection = sLine.substr(1, squareBracketIndex - 1);
            item.section = SZ_Common::trim(currentSection);
            if (item.section.empty())
            {
                sErr = " Section must not be empty ";
                break;
            }

            // 若该右括号不为最后一个字符
            if (squareBracketIndex != sLine.size() - 1)
            {
                sErr = " Redundant characters after section ";
                break;
            }
            if (!comment.empty())
            {
                item.comment = std::move(comment);
            }
            break;
        case '#': // 解析上部注释
        case ';':
            comment = SZ_Common::left_trim(sLine.substr(1));;
            continue;
        case '=': // 处理错误首字符
            sErr = " Key must not be empty ";
            break;
        default: // 解析key = value
            if (mapItem_.empty())
            {
                sErr = " Lack of section ";
                break;
            }
            // 获取等号的位置
            equalIndex = sLine.find('=');
            // 等号不存在则抛出异常
            if (equalIndex == std::string::npos)
            {
                sErr = " Lack of equal sign ";
                break;
            }

            // 提取并处理key
            item.key = SZ_Common::right_trim(sLine.substr(0, equalIndex));

            // 若等号不是最后一个字符
            if (equalIndex != strLine.size() - 1)
            {
                // 提取并处理等号右边子串
                item.value = SZ_Common::left_trim(sLine.substr(equalIndex + 1));
            }

            // 获取section及上部注释
            item.section = currentSection;
            if (!comment.empty())
            {
                item.comment = std::move(comment);
            }
            break;
        }

        // 若解析有误则清空解析结果
        if (!sErr.empty())
        {
            mapItem_.clear();
            vecItem_.clear();
            sErr = "LINE[" + SZ_Common::toString(lineNum) +"] : " + sErr;
            throw SZ_Ini_Exception(sErr);
        }
        dealItem(item);
    }

    return 0;
}

void SZ_Ini::dealItem(const SZ_IniItem &item)
{
    /**
     * 处理section，key均相同的情况
     * 处理多个section分离的情况
     */

    // 无相同配置项，则向vector记录
    if (!isExist(item.section, item.key))
    {
        /**
         * 存在section分开则将section合并为一处
         * 查找第一个section相同的配置项
         */
        auto vIt = std::find_if(vecItem_.begin(), vecItem_.end(), [&](PairSecKey &sk) {
            return item.section == sk.first;
        });
        if (vIt != vecItem_.end())
        {
            // 若存在则查找第一个section不同的位置，并将配置项插入其前
            vIt = std::find_if(vIt, vecItem_.end(), [&](PairSecKey &sk) {
                return item.section != sk.first;
            });
        }
        vecItem_.insert(vIt, std::make_pair(item.section, item.key));
    }

    mapItem_[item.section][item.key] = item;
}

std::string SZ_Ini::file(const std::string &sFile)
{
    if (sFile.empty())
    {
        return sFile_;
    }

    std::string sOldFile = sFile_;

    sFile_ = sFile;

    return sOldFile;
}

void SZ_Ini::read(const std::string &sFile)
{
    vecItem_.clear();
    mapItem_.clear();

    if (!sFile.empty())
    {
        sFile_ = sFile;
    }

    if (sFile_.empty())
    {
        throw SZ_Ini_Exception("File path is empty");
    }

    std::ifstream in(sFile_, std::ios::in);
    std::vector<std::string> vecLine;
    std::string strLine;

    if (!in.is_open())
    {
        throw SZ_Ini_Exception("Can't read file. [" + sFile_ + "]");
    }

    // 按行读取文件
    while (std::getline(in, strLine))
    {
        vecLine.push_back(strLine);
    }

    in.close();

    // 解析文件
    parse(vecLine);
}

void SZ_Ini::write(const std::string &sFile)
{
    if (!sFile.empty())
    {
        sFile_ = sFile;
    }

    if (sFile_.empty())
    {
        throw SZ_Ini_Exception("File path is empty");
    }

    std::ofstream out(sFile_, std::ios::out);
    SZ_IniItem item;
    std::string prevSection;
    int lineNum = 0;

    if (!out.is_open())
    {
        throw SZ_Ini_Exception("Can't write file. [" + sFile_ + "]");
    }

    for (PairSecKey &sk : vecItem_)
    {
        lineNum++;
        item = mapItem_[sk.first][sk.second];

        if (prevSection != item.section)
        {
            if (lineNum != 1)
            {
                out << "\n";
            }
            prevSection = item.section;
        }

        if (!item.comment.empty())
        {
            out << "# " << item.comment << std::endl;
        }

        if (!item.key.empty())
        {
            out << item.key << " = " << item.value << std::endl;
        }
        else
        {
            out << "[" << item.section << "]" << std::endl;
        }
    }

    out.close();
}

void SZ_Ini::clear()
{
    sFile_.clear();
    vecItem_.clear();
    mapItem_.clear();
}

std::vector<std::string> SZ_Ini::sections() const
{
    std::vector<std::string> vecSection;

    for (auto &secKey : mapItem_)
    {
        if (!secKey.second.empty())
        {
            vecSection.push_back(secKey.first);
        }
    }

    return vecSection;
}

std::vector<std::string> SZ_Ini::keys(const std::string &sSection) const
{
    std::vector<std::string> vecKey;

    if (auto sit = mapItem_.find(sSection); sit != mapItem_.end())
    {
        for (auto &keyItem : sit->second)
        {
            if (!keyItem.first.empty())
            {
                vecKey.push_back(keyItem.first);
            }
        }
    }

    return vecKey;
}

std::map<std::string, std::string> SZ_Ini::readValueMap(const std::string &sSection) const
{
    std::map<std::string, std::string> keyValues;
    if (auto sit = mapItem_.find(sSection); sit != mapItem_.end())
    {
        for (auto &kv : sit->second)
        {
            if (!kv.second.key.empty())
            {
                keyValues[kv.second.key] = kv.second.value;
            }
        }
    }

    return keyValues;
}

int SZ_Ini::writeValue(const std::string &sSection, const std::string &sKey, const std::string &sValue)
{
    if (!isExist(sSection, sKey))
    {
        return -1;
    }
    mapItem_[sSection][sKey].value = sValue;

    return 0;
}

std::string SZ_Ini::readValue(const std::string& sSection, const std::string& sKey, const std::string &sDefault) const
{
    if (isExist(sSection, sKey))
    {
        return mapItem_.at(sSection).at(sKey).value;
    }
    return sDefault;
}

int SZ_Ini::writeItem(const SZ_IniItem &item)
{
    if (!isExist(item.section, item.key))
    {
        return -1;
    }
    mapItem_[item.section][item.key] = item;

    return 0;
}

SZ_Ini::SZ_IniItem SZ_Ini::readItem(const std::string &sSection, const std::string &sKey, const SZ_IniItem &defaultItem) const
{
    if (isExist(sSection, sKey))
    {
        return mapItem_.at(sSection).at(sKey);
    }
    return defaultItem;
}

int SZ_Ini::insert(const SZ_IniItem &item)
{
    SZ_IniItem reItem;
    reItem.section = SZ_Common::trim(item.section);
    reItem.key = SZ_Common::trim(item.key);
    reItem.value = SZ_Common::trim(item.value);
    reItem.comment = SZ_Common::trim(item.comment);

    // section不得为空，key为空时，value不得为空
    if (reItem.section.empty() || (reItem.key.empty() && !reItem.value.empty()))
    {
        return -1;
    }

    // 配置项存在则返回错误
    if (isExist(reItem.section, reItem.key))
    {
        return -1;
    }

    // 当前未创建section则创建section
    if (mapItem_.find(reItem.section) == mapItem_.end())
    {
        SZ_IniItem secItem = {.section = reItem.section};

        if (reItem.key.empty())
        {
            secItem.comment = reItem.comment;
        }
        dealItem(secItem);
    }

    dealItem(reItem);

    return 0;
}

int SZ_Ini::insert(const std::string &sSection, const std::string &sKey, const std::string &sValue, const std::string &sComment)
{
    SZ_IniItem item = {
        .section = sSection,
        .key = sKey,
        .value = sValue,
        .comment = sComment};

    return insert(item);
}

int SZ_Ini::erase(const std::string &sSection)
{
    if (!isExist(sSection))
    {
        return -1;
    }
    mapItem_.erase(sSection);
    vecItem_.erase(std::remove_if(vecItem_.begin(), vecItem_.end(), [&](PairSecKey &sk) {
                        return sSection == sk.first;
                    }), vecItem_.end());

    return 0;
}

int SZ_Ini::erase(const std::string &sSection, const std::string &sKey)
{
    if (!isExist(sSection, sKey))
    {
        return -1;
    }
    mapItem_[sSection].erase(sKey);
    vecItem_.erase(std::remove_if(vecItem_.begin(), vecItem_.end(), [&](PairSecKey &sk) {
                        return sSection == sk.first && sKey == sk.second;
                    }), vecItem_.end());
    return 0;
}

} // namespace SZ
