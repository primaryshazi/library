#ifndef SZLIBRARY_SZJSON_H
#define SZLIBRARY_SZJSON_H

#include "SZException.h"
#include "SZCommon.h"

#include <string>
#include <vector>
#include <memory>
#include <unordered_map>

namespace SZ
{

/**
 * 解析类型
 */
enum class SZ_JsonParseType : int
{
    SZ_JSON_PARSE_NULL      = 0,     // null
    SZ_JSON_PARSE_NUMBER    = 1,    // 数字
    SZ_JSON_PARSE_BOOL      = 2,    // 布尔
    SZ_JSON_PARSE_STRING    = 3,    // 字符串
    SZ_JSON_PARSE_ARRAY     = 4,    // 数组
    SZ_JSON_PARSE_OBJECT    = 5     // 对象
};

class SZ_Json_Exception : public SZ_Exception
{
public:
    SZ_Json_Exception(const std::string &sErr) : SZ_Exception("SZ_JSON", sErr) {}
    virtual ~SZ_Json_Exception() noexcept {}
};

class SZ_JsonValue
{
public:
    SZ_JsonValue() {}

    virtual SZ_JsonParseType type() = 0;

    virtual ~SZ_JsonValue() {}
};

typedef std::shared_ptr<SZ_JsonValue> SZ_JsonValuePtr;

class SZ_JsonNull : public SZ_JsonValue
{
public:
    SZ_JsonNull() : value_("null") {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_NULL; }

    virtual ~SZ_JsonNull() override {}

public:
    std::string value_;
};

typedef std::shared_ptr<SZ_JsonNull> SZ_JsonNullPtr;

class SZ_JsonNumber : public SZ_JsonValue
{
public:
    SZ_JsonNumber(double value = 0, bool isInt = false) : value_(value), isInt_(isInt) {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_NUMBER; }

    virtual ~SZ_JsonNumber() override {}

public:
    double value_;
    bool isInt_;
};

typedef std::shared_ptr<SZ_JsonNumber> SZ_JsonNumberPtr;

class SZ_JsonBool : public SZ_JsonValue
{
public:
    SZ_JsonBool(bool value = false) : value_(value) {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_BOOL; }

    virtual ~SZ_JsonBool() override {}

public:
    bool value_;
};

typedef std::shared_ptr<SZ_JsonBool> SZ_JsonBoolPtr;

class SZ_JsonString : public SZ_JsonValue
{
public:
    SZ_JsonString(const std::string &value = "") : value_(value) {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_STRING; }

    virtual ~SZ_JsonString() override {}

public:
    std::string value_;
};

typedef std::shared_ptr<SZ_JsonString> SZ_JsonStringPtr;

class SZ_JsonArray : public SZ_JsonValue
{
public:
    SZ_JsonArray() {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_ARRAY; }

    virtual ~SZ_JsonArray() override {}

public:
    std::vector<std::shared_ptr<SZ_JsonValue>> value_;
};

typedef std::shared_ptr<SZ_JsonArray> SZ_JsonArrayPtr;

class SZ_JsonObject : public SZ_JsonValue
{
public:
    SZ_JsonObject() {}

    virtual SZ_JsonParseType type() override { return SZ_JsonParseType::SZ_JSON_PARSE_OBJECT; }

    virtual ~SZ_JsonObject() override {}

public:
    std::unordered_map<std::string, std::shared_ptr<SZ_JsonValue>> value_;
};

typedef std::shared_ptr<SZ_JsonObject> SZ_JsonObjectPtr;

class SZ_JsonManager
{
    class SZ_JsonReader
    {
    public:
        SZ_JsonReader();

        SZ_JsonReader(const char *buffer, size_t length);

        ~SZ_JsonReader();

        /**
         * @brief 分配buffer
         *
         * @param buffer
         * @param length
         */
        void assign(const char *buffer, size_t length);

        /**
         * @brief 获取buufer
         *
         * @return const char*
         */
        const char *buffer() const;

        /**
         * @brief 获取buffer长度
         *
         * @return size_t
         */
        size_t length() const;

        /**
         * @brief 获取当前位置
         *
         * @return size_t
         */
        size_t cur() const;

        /**
         * @brief 读取并前进
         *
         * @return char
         */
        char readNext();

        /**
         * @brief 读取并后退
         *
         * @return char
         */
        char readPrev();

        /**
         * @brief 读取
         *
         * @return char
         */
        char peek() const;

        /**
         * @brief 前进
         */
        void next();

        /**
         * @brief 后退
         */
        void prev();

        /**
         * @brief 是否开始
         *
         * @return bool
         */
        bool isBegin() const;

        /**
         * @brief 是否结束
         *
         * @return bool
         */
        bool isEnd() const;

        /**
         * @brief 回到开始
         */
        void toBegin();

        /**
         * @brief 回到结束
         */
        void toEnd();

    protected:
        /**
         * @brief 校验位置
         *
         * @param isNext
         */
        void verify(bool isNext) const;

    private:
        size_t cur_;            // 当前位置
        size_t length_;         // 缓冲长度
        const char *buffer_;    // 缓冲区
    };

public:
    /**
     * @brief 写入至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeValue(const SZ_JsonValuePtr &ptr, std::string &str);

    /**
     * @brief 写入空至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeNull(const SZ_JsonNullPtr &ptr, std::string &str);

    /**
     * @brief 写入数字至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeNumber(const SZ_JsonNumberPtr &ptr, std::string &str);

    /**
     * @brief 写入布尔至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeBool(const SZ_JsonBoolPtr &ptr, std::string &str);

    /**
     * @brief 写入字符串至字符串
     *
     * @param value
     * @param str
     */
    static void writeString(const std::string &value, std::string &str);

    /**
     * @brief 写入字符串至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeString(const SZ_JsonStringPtr &ptr, std::string &str);

    /**
     * @brief 写入数组至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeArray(const SZ_JsonArrayPtr &ptr, std::string &str);

    /**
     * @brief 写入对象至字符串
     *
     * @param ptr
     * @param str
     */
    static void writeObject(const SZ_JsonObjectPtr &ptr, std::string &str);

    /**
     * @brief 从字串串中读取
     *
     * @param str
     * @return SZ_JsonValuePtr
     */
    static SZ_JsonValuePtr readValue(const std::string &str);

    /**
     * @brief 从缓冲中读取
     *
     * @param reader
     * @return SZ_JsonValuePtr
     */
    static SZ_JsonValuePtr readValue(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取空
     *
     * @param reader
     * @return SZ_JsonValuePtr
     */
    static SZ_JsonValuePtr readNull(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取数字
     *
     * @param reader
     * @return SZ_JsonNumberPtr
     */
    static SZ_JsonNumberPtr readNumber(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取布尔
     *
     * @param reader
     * @return SZ_JsonBoolPtr
     */
    static SZ_JsonBoolPtr readBool(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取字符串
     *
     * @param reader
     * @return SZ_JsonStringPtr
     */
    static SZ_JsonStringPtr readString(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取数组
     *
     * @param reader
     * @return SZ_JsonArrayPtr
     */
    static SZ_JsonArrayPtr readArray(SZ_JsonReader &reader);

    /**
     * @brief 从缓冲中读取对象
     *
     * @param reader
     * @return SZ_JsonObjectPtr
     */
    static SZ_JsonObjectPtr readObject(SZ_JsonReader &reader);

private:
    /**
     * @brief 是否为空白字符
     *
     * @param ch
     * @return true
     * @return false
     */
    static bool isSpace(char ch);

    /**
     * @brief 过滤空白字符
     *
     * @param reader
     * @return char
     */
    static char filterSpace(SZ_JsonReader &reader);
};

class SZ_Json
{
public:
    /**
     * @brief 解析json字符串
     *
     * @param sJson
     * @return SZ_JsonValuePtr
     */
    static SZ_JsonValuePtr parse(const std::string &sJson);

    /**
     * @brief 对象转json
     *
     * @param jsonPtr
     * @return std::string
     */
    static std::string dump(const SZ_JsonValuePtr &jsonPtr);
};

} // namespace SZ

#endif //SZLIBRARY_SZJSON_H
