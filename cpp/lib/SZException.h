#ifndef SZLIBRARY_SZEXCEPTION_H
#define SZLIBRARY_SZEXCEPTION_H

#include <stdexcept>
#include <string>

namespace SZ
{

class SZ_Exception : public std::exception
{
public:
    SZ_Exception(const std::string &sMark, const std::string &sErr);

    virtual ~SZ_Exception() noexcept;

    virtual const char* what() const noexcept override;

private:
    std::string sMessage_;  // 错误信息
};

} // namespace SZ

#endif // SZLIBRARY_SZEXCEPTION_H
