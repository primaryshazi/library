#pragma once

#if defined SZ_USE_MYSQL

#include "SZUtility.h"

class SZ_Mysql_Exception : public SZ_Exception
{
public:
	SZ_Mysql_Exception(const std::string &sErr) : SZ_Exception(__FUNCTION__, sErr) {}
	virtual ~SZ_Mysql_Exception() noexcept {}
};

struct SZ_DBConfig
{
	std::string host;
	std::string username;
	std::string password;
	std::string database;
	std::string charset;
	int port;
	int clientFlag;
	int connectTimeout;
	int readTimeout;
	int writeTimeout;

	SZ_DBConfig() : charset("utf8mb4"), port(3306), clientFlag(0), connectTimeout(5), readTimeout(15), writeTimeout(15) {}
	~SZ_DBConfig() {}

	/**
	 * @brief 加载配置项
	 *
	 * @param mapConfig
	 */
	void loadConfig(const std::map<std::string, std::string> &mapConfig);

	friend std::ostream &operator<<(std::ostream &os, const SZ_DBConfig &config);
};

class SZ_DBResult
{
public:
	class SZ_DBRow
	{
	public:
		SZ_DBRow(const std::map<std::string, std::string> &row);
		~SZ_DBRow();

		const std::string &operator[](const std::string &field);

	private:
		const std::map<std::string, std::string> &row_;
	};

public:
	SZ_DBResult();
	~SZ_DBResult();

	std::vector<std::map<std::string, std::string>> &data();

	size_t size();

	SZ_DBRow operator[](size_t i);

private:
	std::vector<std::map<std::string, std::string>> result_;
};

class SZ_Mysql : public SZ_Uncopy
{
public:
	SZ_Mysql();

	~SZ_Mysql();

	/**
	 * @brief 初始化
	 *
	 * @param sHost
	 * @param iPort
	 * @param sUsername
	 * @param sPassword
	 * @param sDatabase
	 * @param sCharset
	 * @param iClientFlag
	 */
	void initialize(const std::string &sHost, int iPort, const std::string &sUsername = "", const std::string &sPassword = "",
					const std::string &sDatabase = "", const std::string &sCharset = "", int iClientFlag = 0);

	/**
	 * @brief 初始化
	 *
	 * @param config
	 */
	void initialize(const SZ_DBConfig &config);

	/**
	 * @brief 链接数据库
	 */
	void connect();

	/**
	 * @brief 断开数据库
	 */
	void disconnect();

	/**
	 * @brief 获取连接句柄
	 *
	 * @return MYSQL*
	 */
	MYSQL *handle();

	/**
	 * @brief 查询
	 *
	 * @param sSql
	 * @return SZ_DBResult
	 */
	SZ_DBResult query(const std::string &sSql);

	/**
	 * @brief 执行
	 *
	 * @param sSql
	 */
	void execute(const std::string &sSql);

	/**
	 * @brief 执行插入语句
	 *
	 * @param sSql
	 * @return size_t
	 */
	size_t executeInsert(const std::string &sSql);

	/**
	 * @brief 执行更新语句
	 *
	 * @param sSql
	 * @return size_t
	 */
	size_t executeUpdate(const std::string &sSql);

	/**
	 * @brief 执行删除语句
	 *
	 * @param sSql
	 * @return size_t
	 */
	size_t executeDelete(const std::string &sSql);

	/**
	 * @brief 获取受影响的行数
	 *
	 * @return size_t
	 */
	size_t affectedRows();

	/**
	 * @brief 返回下一个插入的自增ID
	 *
	 * @return size_t
	 */
	size_t lastInsertId();

	/**
	 * @brief 转移字符串
	 *
	 * @param sFrom
	 * @return std::string
	 */
	std::string escapeString(const std::string &sFrom);

private:
	SZ_DBConfig config_; // 配置项
	bool isConnect_;	 // 是否连接
	MYSQL *handle_;		 // 连接句柄
};

#endif // SZ_USE_MYSQL
