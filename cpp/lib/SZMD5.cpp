#include "SZMD5.h"

namespace SZ
{

#ifndef SZ_MD5_GET_ULONG_LE
#define SZ_MD5_GET_ULONG_LE(n, b, i)                           \
{                                                       \
    (n) = ( (unsigned long) (b)[(i)    ]       )        \
        | ( (unsigned long) (b)[(i) + 1] <<  8 )        \
        | ( (unsigned long) (b)[(i) + 2] << 16 )        \
        | ( (unsigned long) (b)[(i) + 3] << 24 );       \
}
#endif

#ifndef SZ_MD5_PUT_ULONG_LE
#define SZ_MD5_PUT_ULONG_LE(n, b, i)                           \
{                                                       \
    (b)[(i)    ] = (unsigned char) ( (n)       );       \
    (b)[(i) + 1] = (unsigned char) ( (n) >>  8 );       \
    (b)[(i) + 2] = (unsigned char) ( (n) >> 16 );       \
    (b)[(i) + 3] = (unsigned char) ( (n) >> 24 );       \
}
#endif

#define SZ_MD5_ROTATE_LEFT(x, n) (((x) << (n)) | ((x) >> (32-(n))))

unsigned char SZ_MD5::PADDING_[64] =
{
    0x80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
};

void SZ_MD5::md5init(MD5_CTX *context)
{
    context->count[0] = context->count[1] = 0;
    context->state[0] = 0x67452301;
    context->state[1] = 0xefcdab89;
    context->state[2] = 0x98badcfe;
    context->state[3] = 0x10325476;
}

void SZ_MD5::md5process(MD5_CTX *context, const unsigned char data[64])
{
    unsigned long X[16], A, B, C, D;

    SZ_MD5_GET_ULONG_LE(X[0], data, 0);
    SZ_MD5_GET_ULONG_LE(X[1], data, 4);
    SZ_MD5_GET_ULONG_LE(X[2], data, 8);
    SZ_MD5_GET_ULONG_LE(X[3], data, 12);
    SZ_MD5_GET_ULONG_LE(X[4], data, 16);
    SZ_MD5_GET_ULONG_LE(X[5], data, 20);
    SZ_MD5_GET_ULONG_LE(X[6], data, 24);
    SZ_MD5_GET_ULONG_LE(X[7], data, 28);
    SZ_MD5_GET_ULONG_LE(X[8], data, 32);
    SZ_MD5_GET_ULONG_LE(X[9], data, 36);
    SZ_MD5_GET_ULONG_LE(X[10], data, 40);
    SZ_MD5_GET_ULONG_LE(X[11], data, 44);
    SZ_MD5_GET_ULONG_LE(X[12], data, 48);
    SZ_MD5_GET_ULONG_LE(X[13], data, 52);
    SZ_MD5_GET_ULONG_LE(X[14], data, 56);
    SZ_MD5_GET_ULONG_LE(X[15], data, 60);

#define SZ_MD5_S_DEAL(x,n) ((x << n) | ((x & 0xFFFFFFFF) >> (32 - n)))

#define SZ_MD5_P_DEAL(a, b, c, d, k, s, t)                      \
    {                                               \
        a += SZ_MD5_F_DEAL(b,c,d) + X[k] + t; a = SZ_MD5_S_DEAL(a,s) + b;   \
    }

    A = context->state[0];
    B = context->state[1];
    C = context->state[2];
    D = context->state[3];

#define SZ_MD5_F_DEAL(x, y, z) (z ^ (x & (y ^ z)))

    SZ_MD5_P_DEAL(A, B, C, D, 0, 7, 0xD76AA478);
    SZ_MD5_P_DEAL(D, A, B, C, 1, 12, 0xE8C7B756);
    SZ_MD5_P_DEAL(C, D, A, B, 2, 17, 0x242070DB);
    SZ_MD5_P_DEAL(B, C, D, A, 3, 22, 0xC1BDCEEE);
    SZ_MD5_P_DEAL(A, B, C, D, 4, 7, 0xF57C0FAF);
    SZ_MD5_P_DEAL(D, A, B, C, 5, 12, 0x4787C62A);
    SZ_MD5_P_DEAL(C, D, A, B, 6, 17, 0xA8304613);
    SZ_MD5_P_DEAL(B, C, D, A, 7, 22, 0xFD469501);
    SZ_MD5_P_DEAL(A, B, C, D, 8, 7, 0x698098D8);
    SZ_MD5_P_DEAL(D, A, B, C, 9, 12, 0x8B44F7AF);
    SZ_MD5_P_DEAL(C, D, A, B, 10, 17, 0xFFFF5BB1);
    SZ_MD5_P_DEAL(B, C, D, A, 11, 22, 0x895CD7BE);
    SZ_MD5_P_DEAL(A, B, C, D, 12, 7, 0x6B901122);
    SZ_MD5_P_DEAL(D, A, B, C, 13, 12, 0xFD987193);
    SZ_MD5_P_DEAL(C, D, A, B, 14, 17, 0xA679438E);
    SZ_MD5_P_DEAL(B, C, D, A, 15, 22, 0x49B40821);

#undef SZ_MD5_F_DEAL

#define SZ_MD5_F_DEAL(x,y,z) (y ^ (z & (x ^ y)))

    SZ_MD5_P_DEAL(A, B, C, D, 1, 5, 0xF61E2562);
    SZ_MD5_P_DEAL(D, A, B, C, 6, 9, 0xC040B340);
    SZ_MD5_P_DEAL(C, D, A, B, 11, 14, 0x265E5A51);
    SZ_MD5_P_DEAL(B, C, D, A, 0, 20, 0xE9B6C7AA);
    SZ_MD5_P_DEAL(A, B, C, D, 5, 5, 0xD62F105D);
    SZ_MD5_P_DEAL(D, A, B, C, 10, 9, 0x02441453);
    SZ_MD5_P_DEAL(C, D, A, B, 15, 14, 0xD8A1E681);
    SZ_MD5_P_DEAL(B, C, D, A, 4, 20, 0xE7D3FBC8);
    SZ_MD5_P_DEAL(A, B, C, D, 9, 5, 0x21E1CDE6);
    SZ_MD5_P_DEAL(D, A, B, C, 14, 9, 0xC33707D6);
    SZ_MD5_P_DEAL(C, D, A, B, 3, 14, 0xF4D50D87);
    SZ_MD5_P_DEAL(B, C, D, A, 8, 20, 0x455A14ED);
    SZ_MD5_P_DEAL(A, B, C, D, 13, 5, 0xA9E3E905);
    SZ_MD5_P_DEAL(D, A, B, C, 2, 9, 0xFCEFA3F8);
    SZ_MD5_P_DEAL(C, D, A, B, 7, 14, 0x676F02D9);
    SZ_MD5_P_DEAL(B, C, D, A, 12, 20, 0x8D2A4C8A);

#undef SZ_MD5_F_DEAL

#define SZ_MD5_F_DEAL(x,y,z) (x ^ y ^ z)

    SZ_MD5_P_DEAL(A, B, C, D, 5, 4, 0xFFFA3942);
    SZ_MD5_P_DEAL(D, A, B, C, 8, 11, 0x8771F681);
    SZ_MD5_P_DEAL(C, D, A, B, 11, 16, 0x6D9D6122);
    SZ_MD5_P_DEAL(B, C, D, A, 14, 23, 0xFDE5380C);
    SZ_MD5_P_DEAL(A, B, C, D, 1, 4, 0xA4BEEA44);
    SZ_MD5_P_DEAL(D, A, B, C, 4, 11, 0x4BDECFA9);
    SZ_MD5_P_DEAL(C, D, A, B, 7, 16, 0xF6BB4B60);
    SZ_MD5_P_DEAL(B, C, D, A, 10, 23, 0xBEBFBC70);
    SZ_MD5_P_DEAL(A, B, C, D, 13, 4, 0x289B7EC6);
    SZ_MD5_P_DEAL(D, A, B, C, 0, 11, 0xEAA127FA);
    SZ_MD5_P_DEAL(C, D, A, B, 3, 16, 0xD4EF3085);
    SZ_MD5_P_DEAL(B, C, D, A, 6, 23, 0x04881D05);
    SZ_MD5_P_DEAL(A, B, C, D, 9, 4, 0xD9D4D039);
    SZ_MD5_P_DEAL(D, A, B, C, 12, 11, 0xE6DB99E5);
    SZ_MD5_P_DEAL(C, D, A, B, 15, 16, 0x1FA27CF8);
    SZ_MD5_P_DEAL(B, C, D, A, 2, 23, 0xC4AC5665);

#undef SZ_MD5_F_DEAL

#define SZ_MD5_F_DEAL(x,y,z) (y ^ (x | ~z))

    SZ_MD5_P_DEAL(A, B, C, D, 0, 6, 0xF4292244);
    SZ_MD5_P_DEAL(D, A, B, C, 7, 10, 0x432AFF97);
    SZ_MD5_P_DEAL(C, D, A, B, 14, 15, 0xAB9423A7);
    SZ_MD5_P_DEAL(B, C, D, A, 5, 21, 0xFC93A039);
    SZ_MD5_P_DEAL(A, B, C, D, 12, 6, 0x655B59C3);
    SZ_MD5_P_DEAL(D, A, B, C, 3, 10, 0x8F0CCC92);
    SZ_MD5_P_DEAL(C, D, A, B, 10, 15, 0xFFEFF47D);
    SZ_MD5_P_DEAL(B, C, D, A, 1, 21, 0x85845DD1);
    SZ_MD5_P_DEAL(A, B, C, D, 8, 6, 0x6FA87E4F);
    SZ_MD5_P_DEAL(D, A, B, C, 15, 10, 0xFE2CE6E0);
    SZ_MD5_P_DEAL(C, D, A, B, 6, 15, 0xA3014314);
    SZ_MD5_P_DEAL(B, C, D, A, 13, 21, 0x4E0811A1);
    SZ_MD5_P_DEAL(A, B, C, D, 4, 6, 0xF7537E82);
    SZ_MD5_P_DEAL(D, A, B, C, 11, 10, 0xBD3AF235);
    SZ_MD5_P_DEAL(C, D, A, B, 2, 15, 0x2AD7D2BB);
    SZ_MD5_P_DEAL(B, C, D, A, 9, 21, 0xEB86D391);

#undef SZ_MD5_F_DEAL

    context->state[0] += A;
    context->state[1] += B;
    context->state[2] += C;
    context->state[3] += D;
}

std::string SZ_MD5::md5file(const std::string &filename)
{
    unsigned char sOutBuffer[16];
    unsigned char buf[16 * 1024];
    FILE *f;
    size_t n;
    MD5_CTX context;
    if ((f = fopen(filename.c_str(), "rb")) == nullptr)
    {
        throw SZ_MD5_Exception("Can not open file \"" + filename + "\"");
    }

    md5init(&context);
    while ((n = fread(buf, 1, sizeof(buf), f)) > 0)
    {
        md5update(&context, buf, (int)n);
    }
    md5final(sOutBuffer, &context);
    fclose(f);

    return binstr((const void *)sOutBuffer, sizeof(sOutBuffer), "");
}

void SZ_MD5::md5update(MD5_CTX *ctx, unsigned char *input, size_t ilen)
{
    unsigned int fill;
    unsigned long left;
    if (ilen <= 0)
        return;
    left = ctx->count[0] & 0x3F;
    fill = 64 - left;
    ctx->count[0] += ilen;
    ctx->count[0] &= 0xFFFFFFFF;
    if (ctx->count[0] < (unsigned long)ilen)
        ctx->count[1]++;
    if (left && ilen >= fill)
    {
        memcpy((void *)(ctx->buffer + left), (void *)input, fill);
        md5process(ctx, ctx->buffer);
        input += fill;
        ilen -= fill;
        left = 0;
    }
    while (ilen >= 64)
    {
        md5process(ctx, input);
        input += 64;
        ilen -= 64;
    }
    if (ilen > 0)
    {
        memcpy((void *)(ctx->buffer + left), (void *)input, ilen);
    }
}


void SZ_MD5::md5final(unsigned char output[16], MD5_CTX *ctx)
{
    unsigned long last, padn;
    unsigned long high, low;
    unsigned char msglen[8];

    high = (ctx->count[0] >> 29)
        | (ctx->count[1] << 3);
    low = (ctx->count[0] << 3);

    SZ_MD5_PUT_ULONG_LE(low, msglen, 0);
    SZ_MD5_PUT_ULONG_LE(high, msglen, 4);

    last = ctx->count[0] & 0x3F;
    padn = (last < 56) ? (56 - last) : (120 - last);

    md5update(ctx, (unsigned char *)PADDING_, padn);
    md5update(ctx, msglen, 8);

    SZ_MD5_PUT_ULONG_LE(ctx->state[0], output, 0);
    SZ_MD5_PUT_ULONG_LE(ctx->state[1], output, 4);
    SZ_MD5_PUT_ULONG_LE(ctx->state[2], output, 8);
    SZ_MD5_PUT_ULONG_LE(ctx->state[3], output, 12);
}

void SZ_MD5::encode(unsigned char *output, uint32_t *input, size_t length)
{
    for (unsigned int i = 0, j = 0; j < length; i++, j += 4)
    {
        output[j] = (unsigned char)(input[i] & 0xff);
        output[j + 1] = (unsigned char)((input[i] >> 8) & 0xff);
        output[j + 2] = (unsigned char)((input[i] >> 16) & 0xff);
        output[j + 3] = (unsigned char)((input[i] >> 24) & 0xff);
    }
}

void SZ_MD5::decode(uint32_t *output, unsigned char *input, size_t length)
{
    for (size_t i = 0, j = 0; j < length; i++, j += 4)
    {
        output[i] = ((uint32_t)input[j])
            | (((uint32_t)input[j + 1]) << 8)
            | (((uint32_t)input[j + 2]) << 16)
            | (((uint32_t)input[j + 3]) << 24);
    }
}

void SZ_MD5::md5memcpy(unsigned char *output, unsigned char *input, size_t length)
{
    for (size_t i = 0; i < length; i++)
    {
        output[i] = input[i];
    }
}

void SZ_MD5::md5memset(unsigned char *output, int value, size_t length)
{
    for (size_t i = 0; i < length; i++)
    {
        ((char *)output)[i] = (char)value;
    }
}

std::vector<char> SZ_MD5::md5bin(const std::string &buffer)
{
    return md5bin(buffer.c_str(), buffer.size());
}

std::vector<char> SZ_MD5::md5bin(const char *buffer, size_t length)
{
    std::vector<char> sOutBuffer;
    sOutBuffer.resize(16);

    MD5_CTX context;
    md5init(&context);
    md5update(&context, (unsigned char *)buffer, length);
    md5final((unsigned char *)&sOutBuffer[0], &context);

    return sOutBuffer;
}

std::string SZ_MD5::md5str(const std::string &buffer)
{
    return md5str(buffer.c_str(), buffer.size());
}

std::string SZ_MD5::md5str(const char *buffer, size_t length)
{
    std::vector<char> s = md5bin(buffer, length);
    return binstr((const void *)s.data(), s.size(), "");
}

std::string SZ_MD5::binstr(const void *buf, size_t length, const std::string &split)
{
    if (nullptr == buf || length <= 0)
    {
        return "";
    }

    std::string sOut;
    char sBuf[255];
    const char *p = (const char *)buf;

    for (size_t i = 0; i < length; ++i, ++p)
    {
        snprintf(sBuf, sizeof(sBuf), "%02x%s", (unsigned char)*p, split.c_str());
        sOut += sBuf;
    }

    return sOut;
}

} // namespace SZ
