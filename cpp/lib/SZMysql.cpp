#include "SZMysql.h"

#if defined SZ_USE_MYSQL

static std::string mysqlError(MYSQL *mysqlHandle)
{
    std::string str;
    str += std::string("code:") + SZ_Common::toString(mysql_errno(mysqlHandle));
    str += std::string(", message: ") + mysql_error(mysqlHandle);
    str += std::string(", status: ") + mysql_sqlstate(mysqlHandle);
    return str;
}

void SZ_DBConfig::loadConfig(const std::map<std::string, std::string> &mapConfig)
{
    auto mConf = mapConfig;
    host = mConf["host"];
    username = mConf["username"];
    password = mConf["password"];
    database = mConf["database"];
    charset = mConf["charset"];

    if (!mConf["port"].empty())
    {
        port = SZ_Common::stringTo<int>(mConf["port"]);
    }
    if (!mConf["client_flag"].empty())
    {
        clientFlag = SZ_Common::stringTo<int>(mConf["client_flag"]);
    }
    if (!mConf["connect_timeout"].empty())
    {
        connectTimeout = SZ_Common::stringTo<int>(mConf["connect_timeout"]);
    }
    if (!mConf["read_timeout"].empty())
    {
        readTimeout = SZ_Common::stringTo<int>(mConf["read_timeout"]);
    }
    if (!mConf["write_timeout"].empty())
    {
        writeTimeout = SZ_Common::stringTo<int>(mConf["write_timeout"]);
    }
}

std::ostream &operator<<(std::ostream &os, const SZ_DBConfig &config)
{
    os << "[" << config.host << "][" << config.username << "][" << config.password << "][" << config.database << "]["
       << config.charset << "][" << config.port << "][" << config.clientFlag << "][" << config.connectTimeout << "]["
       << config.readTimeout << "][" << config.writeTimeout << "]";
    return os;
}

SZ_DBResult::SZ_DBRow::SZ_DBRow(const std::map<std::string, std::string> &row) : row_(row)
{
}

SZ_DBResult::SZ_DBRow::~SZ_DBRow()
{
}

const std::string &SZ_DBResult::SZ_DBRow::operator[](const std::string &field)
{
    auto it = row_.find(field);
    if (it == row_.end())
    {
        throw SZ_Mysql_Exception("Field not found: \"" + field + "\"");
    }
    return it->second;
}

SZ_DBResult::SZ_DBResult()
{
}

SZ_DBResult::~SZ_DBResult()
{
}

std::vector<std::map<std::string, std::string>> &SZ_DBResult::data()
{
    return result_;
}

size_t SZ_DBResult::size()
{
    return result_.size();
}

SZ_DBResult::SZ_DBRow SZ_DBResult::operator[](size_t i)
{
    return SZ_DBRow(result_[i]);
}

SZ_Mysql::SZ_Mysql() : isConnect_(false), handle_(nullptr)
{
}

SZ_Mysql::~SZ_Mysql()
{
    if (nullptr != handle_)
    {
        mysql_close(handle_);
        handle_ = nullptr;
    }
}

void SZ_Mysql::initialize(const std::string &sHost, int iPort, const std::string &sUsername, const std::string &sPassword,
                          const std::string &sDatabase, const std::string &sCharset, int iClientFlag)
{
    config_.host = sHost;
    config_.username = sUsername;
    config_.password = sPassword;
    config_.database = sDatabase;
    config_.charset = sCharset;
    config_.port = iPort;
    config_.clientFlag = iClientFlag;
}

void SZ_Mysql::initialize(const SZ_DBConfig &config)
{
    config_ = config;
}

void SZ_Mysql::connect()
{
    disconnect();

    if (nullptr == handle_)
    {
        handle_ = mysql_init(nullptr);
        if (nullptr == handle_)
        {
            throw SZ_Mysql_Exception("mysql_init: [" + mysqlError(handle_) + "]");
        }
    }

    // 建立连接后, 自动调用设置字符集语句
    if (!config_.charset.empty())
    {
        if (mysql_options(handle_, MYSQL_SET_CHARSET_NAME, config_.charset.c_str()))
        {
            throw SZ_Mysql_Exception("mysql_options MYSQL_SET_CHARSET_NAME: [" + config_.charset + "] [" + mysqlError(handle_) + "]");
        }
    }

    // 设置连接超时
    if (config_.connectTimeout > 0)
    {
        if (mysql_options(handle_, MYSQL_OPT_CONNECT_TIMEOUT, &config_.connectTimeout))
        {
            throw SZ_Mysql_Exception("mysql_options MYSQL_OPT_CONNECT_TIMEOUT: [" + SZ_Common::toString(config_.connectTimeout) + "] [" + mysqlError(handle_) + "]");
        }
    }

    // 设置读超时
    if (config_.readTimeout > 0)
    {
        if (mysql_options(handle_, MYSQL_OPT_READ_TIMEOUT, &config_.readTimeout))
        {
            throw SZ_Mysql_Exception("mysql_options MYSQL_OPT_READ_TIMEOUT: [" + SZ_Common::toString(config_.readTimeout) + "] [" + mysqlError(handle_) + "]");
        }
    }

    // 设置写超时
    if (config_.writeTimeout > 0)
    {
        if (mysql_options(handle_, MYSQL_OPT_WRITE_TIMEOUT, &config_.writeTimeout))
        {
            throw SZ_Mysql_Exception("mysql_options MYSQL_OPT_WRITE_TIMEOUT: [" + SZ_Common::toString(config_.writeTimeout) + "] [" + mysqlError(handle_) + "]");
        }
    }

    if (mysql_real_connect(handle_, config_.host.c_str(), config_.username.c_str(), config_.password.c_str(),
                           config_.database.c_str(), config_.port, nullptr, config_.clientFlag) == nullptr)
    {
        throw SZ_Mysql_Exception("mysql_options mysql_real_connect config: [" + SZ_Common::toString(config_) + "] [" + mysqlError(handle_) + "]");
    }

    isConnect_ = true;
}

void SZ_Mysql::disconnect()
{
    if (nullptr != handle_)
    {
        mysql_close(handle_);
        handle_ = mysql_init(nullptr);
    }
    isConnect_ = false;
}

MYSQL *SZ_Mysql::handle()
{
    return handle_;
}

SZ_DBResult SZ_Mysql::query(const std::string &sSql)
{
    if (!isConnect_)
    {
        connect();
    }

    SZ_DBResult dbResult;

    int iRet = mysql_real_query(handle_, sSql.c_str(), sSql.length());
    if (iRet != 0)
    {
        int iErrno = mysql_errno(handle_);
        if (iErrno == 2013 || iErrno == 2006)
        {
            connect();
            iRet = mysql_real_query(handle_, sSql.c_str(), sSql.length());
        }
    }

    if (iRet != 0)
    {
        throw SZ_Mysql_Exception("mysql_real_query: [ " + sSql + " ] [" + mysqlError(handle_) + "]");
    }

    MYSQL_RES *result = mysql_store_result(handle_);

    if (nullptr == result)
    {
        throw SZ_Mysql_Exception("mysql_store_result: [" + sSql + "] [" + mysqlError(handle_) + "]");
    }

    std::vector<std::string> vFields;
    MYSQL_FIELD *field;
    while ((field = mysql_fetch_field(result)))
    {
        vFields.emplace_back(field->name);
    }

    std::map<std::string, std::string> mRows;
    MYSQL_ROW stRow;

    while ((stRow = mysql_fetch_row(result)) != nullptr)
    {
        mRows.clear();
        unsigned long *lengths = mysql_fetch_lengths(result);
        for (size_t i = 0; i < vFields.size(); i++)
        {
            if (nullptr != stRow[i])
            {
                mRows[vFields[i]] = std::string(stRow[i], lengths[i]);
            }
            else
            {
                mRows[vFields[i]] = "";
            }
        }

        dbResult.data().push_back(mRows);
    }

    mysql_free_result(result);

    return dbResult;
}

void SZ_Mysql::execute(const std::string &sSql)
{
    if (!isConnect_)
    {
        connect();
    }

    SZ_DBResult dbResult;

    int iRet = mysql_real_query(handle_, sSql.c_str(), sSql.length());
    if (iRet != 0)
    {
        int iErrno = mysql_errno(handle_);
        if (iErrno == 2013 || iErrno == 2006)
        {
            connect();
            iRet = mysql_real_query(handle_, sSql.c_str(), sSql.length());
        }
    }

    if (iRet != 0)
    {
        throw SZ_Mysql_Exception("mysql_real_query: [ " + sSql + " ] [" + mysqlError(handle_) + "]");
    }
}

size_t SZ_Mysql::executeInsert(const std::string &sSql)
{
    execute(sSql);
    return mysql_affected_rows(handle_);
}

size_t SZ_Mysql::executeUpdate(const std::string &sSql)
{
    execute(sSql);
    return mysql_affected_rows(handle_);
}

size_t SZ_Mysql::executeDelete(const std::string &sSql)
{
    execute(sSql);
    return mysql_affected_rows(handle_);
}

size_t SZ_Mysql::affectedRows()
{
    return mysql_affected_rows(handle_);
}

size_t SZ_Mysql::lastInsertId()
{
    return mysql_insert_id(handle_);
}

std::string SZ_Mysql::escapeString(const std::string &sFrom)
{
    std::string sTo;
    std::string::size_type iLen = sFrom.length() * 2 + 1;
    char *pTo = (char *)malloc(iLen);
    memset(pTo, 0, iLen);
    mysql_escape_string(pTo, sFrom.c_str(), sFrom.length());
    sTo = pTo;
    free(pTo);
    return sTo;
}

#endif // SZ_USE_MYSQL
