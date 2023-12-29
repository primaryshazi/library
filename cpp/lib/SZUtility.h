#pragma once

#include "SZCommon.h"

#include <stdexcept>
#include <string>

class SZ_Exception : public std::exception
{
public:
    SZ_Exception(const std::string &sMark, const std::string &sErr) { sMessage_ = "[" + sMark + "] => " + sErr; }

    virtual ~SZ_Exception() noexcept {}

    virtual const char *what() const noexcept { return sMessage_.c_str(); }

private:
    std::string sMessage_;
};

class SZ_Uncopy
{
public:
    SZ_Uncopy() = default;

    virtual ~SZ_Uncopy() = default;

    SZ_Uncopy(const SZ_Uncopy &) = delete;

    SZ_Uncopy(SZ_Uncopy &&) = delete;

    SZ_Uncopy &operator=(const SZ_Uncopy &) = delete;

    SZ_Uncopy &operator=(SZ_Uncopy &&) = delete;
};

template <typename T>
class SZ_Raii
{
public:
    explicit SZ_Raii(T &t) : m_t(t) { ++m_t; }

    virtual ~SZ_Raii() { --m_t; }

private:
    T &m_t;
};
