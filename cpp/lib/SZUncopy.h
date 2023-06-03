#ifndef SZLIBRARY_SZUNCOPY_H
#define SZLIBRARY_SZUNCOPY_H

namespace SZ
{

class SZ_Uncopy
{
public:
    SZ_Uncopy() = default;

    ~SZ_Uncopy() = default;

    SZ_Uncopy(const SZ_Uncopy &) = delete;

    SZ_Uncopy(SZ_Uncopy &&) = delete;

    SZ_Uncopy &operator =(const SZ_Uncopy &) = delete;

    SZ_Uncopy &operator =(SZ_Uncopy &&) = delete;
};

} // namespace SZ

#endif  // SZLIBRARY_SZUNCOPY_H
