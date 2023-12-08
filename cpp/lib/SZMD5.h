#pragma once

#include "SZCommon.h"
#include "SZUtility.h"

#include <fstream>
#include <cstring>
#include <vector>

struct SZ_MD5_Exception : public SZ_Exception
{
    SZ_MD5_Exception(const std::string &sErr) : SZ_Exception(__FUNCTION__, sErr) {}
    virtual ~SZ_MD5_Exception() noexcept {}
};

class SZ_MD5
{
    struct MD5_CTX
    {
        uint32_t state[4];
        uint32_t count[2];
        unsigned char buffer[64];
    };

public:
    /**
     * @brief 16位二进制数
     *
     * @param buffer
     * @return std::vector<char>
     */
    static std::vector<char> md5bin(const std::string &buffer);

    /**
     * @brief 16位二进制数
     *
     * @param buffer
     * @param length
     * @return std::vector<char>
     */
    static std::vector<char> md5bin(const char *buffer, size_t length);

    /**
     * @brief 32位十六进制数
     *
     * @param buffer
     * @return std::string
     */
    static std::string md5str(const std::string &buffer);

    /**
     * @brief 32位十六进制数
     *
     * @param buffer
     * @param length
     * @return std::string
     */
    static std::string md5str(const char *buffer, size_t length);

    /**
     * @brief 32位十六进制数
     *
     * @param fileName
     * @return std::string
     */
    static std::string md5file(const std::string &fileName);

protected:
    /**
     * @brief 初始化
     *
     * @param context
     */
    static void md5init(MD5_CTX *context);

    /**
     * @brief 更新处理
     *
     * @param context
     * @param input
     * @param length
     */
    static void md5update(MD5_CTX *context, unsigned char *input, size_t length);

    /**
     * @brief 最终处理
     *
     * @param digest
     * @param context
     */
    static void md5final(unsigned char digest[16], MD5_CTX *context);

    /**
     * @brief 数值处理
     *
     * @param context
     * @param data
     */
    static void md5process(MD5_CTX *context, const unsigned char data[64]);

    /**
     * @brief 加密
     *
     * @param output
     * @param input
     * @param length
     */
    static void encode(unsigned char *output, uint32_t *input, size_t length);

    /**
     * @brief 解码
     *
     * @param output
     * @param input
     * @param length
     */
    static void decode(uint32_t *output, unsigned char *input, size_t length);

    /**
     * @brief 拷贝
     *
     * @param output
     * @param input
     * @param length
     */
    static void md5memcpy(unsigned char *output, unsigned char *input, size_t length);

    /**
     * @brief 置位
     *
     * @param output
     * @param value
     * @param length
     */
    static void md5memset(unsigned char *output, int value, size_t length);

    /**
     * @brief 二进制串
     *
     * @param buf
     * @param length
     * @param split
     * @return std::string
     */
    static std::string binstr(const void *buf, size_t length, const std::string &split);

    static unsigned char PADDING_[64];
};
