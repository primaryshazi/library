#include "SZException.h"

namespace SZ
{

SZ_Exception::SZ_Exception(const std::string &sMark, const std::string &sErr)
{
    sMessage_ = "[" + sMark + "] => " + sErr;
}

SZ_Exception::~SZ_Exception() noexcept
{
}

const char *SZ_Exception::what() const noexcept
{
    return sMessage_.c_str();
}

} // namespace SZ
