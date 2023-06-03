#include "SZJson.h"

#include <iostream>
#include <cmath>

namespace SZ
{

SZ_JsonManager::SZ_JsonReader::SZ_JsonReader() : SZ_JsonReader(nullptr, 0)
{
}

SZ_JsonManager::SZ_JsonReader::SZ_JsonReader(const char *buffer, size_t length) : cur_(0), length_(length), buffer_(buffer)
{
}

SZ_JsonManager::SZ_JsonReader::~SZ_JsonReader()
{
    cur_ = 0;
    length_ = 0;
    buffer_ = nullptr;
}

void SZ_JsonManager::SZ_JsonReader::assign(const char *buffer, size_t length)
{
    cur_ = 0;
    length_ = length;
    buffer_ = buffer;
}

const char *SZ_JsonManager::SZ_JsonReader::buffer() const
{
    return buffer_;
}

size_t SZ_JsonManager::SZ_JsonReader::length() const
{
    return length_;
}

size_t SZ_JsonManager::SZ_JsonReader::cur() const
{
    return cur_;
}

char SZ_JsonManager::SZ_JsonReader::readNext()
{
    verify(true);
    return *(buffer_ + cur_++);
}

char SZ_JsonManager::SZ_JsonReader::readPrev()
{
    verify(false);
    return *(buffer_ + cur_--);
}

char SZ_JsonManager::SZ_JsonReader::peek() const
{
    return *(buffer_ + cur_);
}

void SZ_JsonManager::SZ_JsonReader::next()
{
    if (cur_ < length_)
    {
        ++cur_;
    }
}

void SZ_JsonManager::SZ_JsonReader::prev()
{
    if (cur_ > 0)
    {
        --cur_;
    }
}

bool SZ_JsonManager::SZ_JsonReader::isBegin() const
{
    return cur_ == 0;
}

bool SZ_JsonManager::SZ_JsonReader::isEnd() const
{
    return cur_ >= length_;
}

void SZ_JsonManager::SZ_JsonReader::toBegin()
{
    cur_ = 0;
}

void SZ_JsonManager::SZ_JsonReader::toEnd()
{
    cur_ = length_;
}

void SZ_JsonManager::SZ_JsonReader::verify(bool isNext) const
{
    if (isNext)
    {
        if (cur_ >= length_)
        {
            throw SZ_Json_Exception("reader buffer overflow upper limit: " + SZ_Common::toString(length_) + "  " + SZ_Common::toString(cur_));
        }
    }
    else
    {
        if (cur_ == 0)
        {
            throw SZ_Json_Exception("reader buufer overflow lower limit: " + SZ_Common::toString(length_) + "  " + SZ_Common::toString(cur_));
        }
    }
}

void SZ_JsonManager::writeValue(const SZ_JsonValuePtr &ptr, std::string &str)
{
    if (ptr != nullptr)
    {
        switch (ptr->type())
        {
        case SZ_JsonParseType::SZ_JSON_PARSE_NULL:
            writeNull(std::dynamic_pointer_cast<SZ_JsonNull>(ptr), str);
            break;
        case SZ_JsonParseType::SZ_JSON_PARSE_NUMBER:
            writeNumber(std::dynamic_pointer_cast<SZ_JsonNumber>(ptr), str);
            break;
        case SZ_JsonParseType::SZ_JSON_PARSE_BOOL:
            writeBool(std::dynamic_pointer_cast<SZ_JsonBool>(ptr), str);
            break;
        case SZ_JsonParseType::SZ_JSON_PARSE_STRING:
            writeString(std::dynamic_pointer_cast<SZ_JsonString>(ptr), str);
            break;
        case SZ_JsonParseType::SZ_JSON_PARSE_ARRAY:
            writeArray(std::dynamic_pointer_cast<SZ_JsonArray>(ptr), str);
            break;
        case SZ_JsonParseType::SZ_JSON_PARSE_OBJECT:
            writeObject(std::dynamic_pointer_cast<SZ_JsonObject>(ptr), str);
            break;
        default:
            throw SZ_Json_Exception("parse type error: " + SZ_Common::toString(static_cast<int>(ptr->type())));
        }
    }
    else
    {
        str += "null";
    }
}

void SZ_JsonManager::writeNull(const SZ_JsonNullPtr &ptr, std::string &str)
{
    str += ptr->value_;
}

void SZ_JsonManager::writeNumber(const SZ_JsonNumberPtr &ptr, std::string &str)
{
    if (std::isnan(ptr->value_))
    {
        str += "null";
    }
    else if (ptr->isInt_)
    {
        str += SZ_Common::toString(static_cast<int64_t>(ptr->value_));
    }
    else
    {
        str += SZ_Common::toString(ptr->value_);
    }
}

void SZ_JsonManager::writeBool(const SZ_JsonBoolPtr &ptr, std::string &str)
{
    str += ptr->value_ ? "true" : "false";
}

void SZ_JsonManager::writeString(const std::string &value, std::string &str)
{
    str += "\"";
    for (auto ch : value)
    {
        switch (ch)
        {
        case '"':
            str += "\\\"";
            break;
        case '\\':
            str += "\\\\";
            break;
        case '/':
            str += "\\/";
            break;
        case '\b':
            str += "\\b";
            break;
        case '\f':
            str += "\\f";
            break;
        case '\n':
            str += "\\n";
            break;
        case '\r':
            str += "\\r";
            break;
        case '\t':
            str += "\\t";
            break;
        default:
            if (static_cast<unsigned char>(ch) < 0x20)
            {
                char buf[16] = "";
                snprintf(buf, sizeof(buf), "\\u%04x", static_cast<unsigned char>(ch));
                str += std::string(buf, 6);
            }
            else
            {
                str += ch;
            }
            break;
        }
    }
    str += "\"";
}

void SZ_JsonManager::writeString(const SZ_JsonStringPtr &ptr, std::string &str)
{
    writeString(ptr->value_, str);
}

void SZ_JsonManager::writeArray(const SZ_JsonArrayPtr &ptr, std::string &str)
{
    str += "[ ";
    bool isFirst = true;
    for (const auto &val : ptr->value_)
    {
        if (isFirst)
        {
            isFirst = false;
        }
        else
        {
            str += ", ";
        }
        writeValue(val, str);
    }
    str += " ]";
}

void SZ_JsonManager::writeObject(const SZ_JsonObjectPtr &ptr, std::string &str)
{
    str += "{ ";
    bool isFirst = true;
    for (const auto &val : ptr->value_)
    {
        if (isFirst)
        {
            isFirst = false;
        }
        else
        {
            str += ", ";
        }
        writeString(val.first, str);
        str += ": ";
        writeValue(val.second, str);
    }
    str += " }";
}

SZ_JsonValuePtr SZ_JsonManager::readValue(const std::string &str)
{
    SZ_JsonReader reader(str.data(), str.length());
    return readValue(reader);
}

SZ_JsonValuePtr SZ_JsonManager::readValue(SZ_JsonReader &reader)
{
    char ch = filterSpace(reader);
    switch (ch)
    {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '-':
        return readNumber(reader);
    case 't':
    case 'f':
        return readBool(reader);
    case '\"':
        return readString(reader);
    case '[':
        return readArray(reader);
    case '{':
        return readObject(reader);
    case 'n':
        return readNull(reader);
    default:
        throw SZ_Json_Exception("read value overflow: " + SZ_Common::toString(reader.length()) + "  " + SZ_Common::toString(reader.cur()));
    }
}

SZ_JsonValuePtr SZ_JsonManager::readNull(SZ_JsonReader &reader)
{
    if (reader.readNext() == 'u' && reader.readNext() == 'l' && reader.readNext() == 'l')
    {
        return std::make_shared<SZ_JsonNull>();
    }

    throw SZ_Json_Exception("read null error pos: " + SZ_Common::toString(reader.cur()));
}

SZ_JsonNumberPtr SZ_JsonManager::readNumber(SZ_JsonReader &reader)
{
    reader.prev();
    int sign = reader.peek() == '-' ? -1 : 1;
    bool isInt = true;
    bool isFirst = true;
    int64_t intPart = 0;
    double floatPart = 0;
    double floatRatio = 1;

    if (sign == -1)
    {
        reader.next();
    }

    while (true)
    {
        char ch = reader.readNext();
        if (ch == '.')
        {
            if (isFirst)
            {
                break;
            }
            if (!isInt)
            {
                break;
            }
            isInt = false;
            floatRatio = 0.1;
        }
        else if (ch >= '0' && ch <= '9')
        {
            if (isInt)
            {
                intPart = intPart * 10 + ch - '0';
            }
            else
            {
                floatPart = floatPart + (ch - '0') * floatRatio;
                floatRatio /= 10;
            }
        }
        else
        {
            reader.prev();
            if (isInt)
            {
                return std::make_shared<SZ_JsonNumber>(static_cast<double>(intPart) * sign, isInt);
            }
            else
            {
                return std::make_shared<SZ_JsonNumber>((static_cast<double>(intPart) + floatPart) * sign, isInt);
            }
        }

        isFirst = false;
    }

    throw SZ_Json_Exception("read number error pos: " + SZ_Common::toString(reader.cur()));
}

SZ_JsonBoolPtr SZ_JsonManager::readBool(SZ_JsonReader &reader)
{
    reader.prev();
    if (reader.readNext() == 't')
    {
        if (reader.readNext() == 'r' && reader.readNext() == 'u' && reader.readNext() == 'e')
        {
            return std::make_shared<SZ_JsonBool>(true);
        }
    }
    else
    {
        if (reader.readNext() == 'a' && reader.readNext() == 'l' && reader.readNext() == 's' && reader.readNext() == 'e')
        {
            return std::make_shared<SZ_JsonBool>(false);
        }
    }

    throw SZ_Json_Exception("read bool error pos: " + SZ_Common::toString(reader.cur()));
}

SZ_JsonStringPtr SZ_JsonManager::readString(SZ_JsonReader &reader)
{
    const char *buf = reader.buffer() + reader.cur();
    uint32_t len = 0;
    std::string value;

    while (true)
    {
        char ch = reader.readNext();
        if (ch == '\\')
        {
            value.append(buf, len);
            buf = buf + len + 2;
            len = 0;
            ch = reader.readNext();
            switch (ch)
            {
            case '\\':
            case '\"':
            case '/':
                value.append(1, ch);
                break;
            case 'b':
                value.append(1, '\b');
                break;
            case 'f':
                value.append(1, '\f');
                break;
            case 'n':
                value.append(1, '\n');
                break;
            case 'r':
                value.append(1, '\r');
                break;
            case 't':
                value.append(1, '\t');
                break;
            case 'u':
            {
                uint32_t uCode = 0;

                for (int i = 0; i < 4; i++)
                {
                    char tmpCh = reader.readNext();
                    if (tmpCh >= 'a' && tmpCh <= 'f')
                        uCode = uCode * 16 + tmpCh - 'a' + 10;
                    else if (tmpCh >= 'A' && tmpCh <= 'F')
                        uCode = uCode * 16 + tmpCh - 'A' + 10;
                    else if (tmpCh >= '0' && tmpCh <= '9')
                        uCode = uCode * 16 + tmpCh - '0';
                    else
                    {
                        throw SZ_Json_Exception("read string unicode error pos: " + SZ_Common::toString(reader.cur()));
                    }
                }

                if (uCode < 0x00080)
                {
                    value.append(1, (char)(uCode & 0xFF));
                }
                else if (uCode < 0x00800)
                {
                    value.append(1, (char)(0xC0 + ((uCode >> 6) & 0x1F)));
                    value.append(1, (char)(0x80 + (uCode & 0x3F)));
                }
                else if (uCode < 0x10000)
                {
                    value.append(1, (char)(0xE0 + ((uCode >> 12) & 0x0F)));
                    value.append(1, (char)(0x80 + ((uCode >> 6) & 0x3F)));
                    value.append(1, (char)(0x80 + (uCode & 0x3F)));
                }
                else
                {
                    value.append(1, (char)(0xF0 + ((uCode >> 18) & 0x07)));
                    value.append(1, (char)(0x80 + ((uCode >> 12) & 0x3F)));
                    value.append(1, (char)(0x80 + ((uCode >> 6) & 0x3F)));
                    value.append(1, (char)(0x80 + (uCode & 0x3F)));
                }
                buf += 4;
                break;
            }
            default:
                throw SZ_Json_Exception("read string error pos: " + SZ_Common::toString(reader.cur()));
            }
        }
        else if (ch == '\"')
        {
            break;
        }
        else
        {
            len++;
        }
    }
    value.append(buf, len);

    return std::make_shared<SZ_JsonString>(value);
}

SZ_JsonArrayPtr SZ_JsonManager::readArray(SZ_JsonReader &reader)
{
    SZ_JsonArrayPtr arrayPtr = std::make_shared<SZ_JsonArray>();
    bool isFirst = true;

    while (true)
    {
        char ch = filterSpace(reader);

        if (isFirst && ch == ']')
        {
            return arrayPtr;
        }

        reader.prev();
        isFirst = false;
        arrayPtr->value_.push_back(readValue(reader));

        ch = filterSpace(reader);
        if (ch == ',')
        {
            continue;
        }
        if (ch == ']')
        {
            return arrayPtr;
        }

        throw SZ_Json_Exception("read array error pos: " + SZ_Common::toString(reader.cur()));
    }
}

SZ_JsonObjectPtr SZ_JsonManager::readObject(SZ_JsonReader &reader)
{
    SZ_JsonObjectPtr objectPtr = std::make_shared<SZ_JsonObject>();
    bool isFirst = true;

    while (true)
    {
        char ch = filterSpace(reader);
        if (isFirst && ch == '}')
        {
            return objectPtr;
        }

        isFirst = false;

        if (ch != '\"')
        {
            throw SZ_Json_Exception("read object \'\"\' error pos: " + SZ_Common::toString(reader.cur()));
        }

        SZ_JsonStringPtr stringPtr = readString(reader);

        ch = filterSpace(reader);
        if (ch != ':')
        {
            throw SZ_Json_Exception("read object \':\' error pos: " + SZ_Common::toString(reader.cur()));
        }

        objectPtr->value_[stringPtr->value_] = readValue(reader);

        ch = filterSpace(reader);
        if (ch == ',')
        {
            continue;
        }
        if (ch == '}')
        {
            return objectPtr;
        }

        throw SZ_Json_Exception("read object error pos: " + SZ_Common::toString(reader.cur()));
    }
}

bool SZ_JsonManager::isSpace(char ch)
{
    if (ch == ' ' || ch == '\t' || ch == '\r' || ch == '\n')
    {
        return true;
    }
    return false;
}

char SZ_JsonManager::filterSpace(SZ_JsonReader &reader)
{
    char ch = reader.readNext();
    while (SZ_JsonManager::isSpace(ch))
    {
        ch = reader.readNext();
    }
    return ch;
}

SZ_JsonValuePtr SZ_Json::parse(const std::string &sJson)
{
    return SZ_JsonManager::readValue(sJson);
}

std::string SZ_Json::dump(const SZ_JsonValuePtr &jsonPtr)
{
    std::string str;
    SZ_JsonManager::writeValue(jsonPtr, str);
    return str;
}

} // namespace SZ
