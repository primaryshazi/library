export namespace SZDATE {
    /**
     * 倒计时格式化 
     * @param ms
     * @param format %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns
     */
    export function countdownFormat(ms: number, format: string = "%D %h:%m:%s") {
        if (format.length == 0) {
            return "";
        }

        const s = Math.floor(ms / 1000);

        let day = Math.floor(s / 86400);
        let hour = Math.floor(s % 86400 / 3600);
        let min = Math.floor(s % 3600 / 60);
        let second = s % 60;
        let micsecond = ms % 1000;

        return format.replace(/(%D)|(%h)|(%m)|(%s)|(%z)/g, (match, D, h, m, s, z) => {
            if (D) {
                return day.toString();
            } else if (h) {
                return hour.toString().padStart(2, "0");
            } else if (m) {
                return min.toString().padStart(2, "0");
            } else if (s) {
                return second.toString().padStart(2, "0");
            } else if (z) {
                return micsecond.toString().padStart(3, "0");
            } else {
                return match;
            }
        });
    }

    /**
     * 时间格式化为字符串
     * @param ms
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns
     */
    export function time2str(ms: number, format: string = "%Y-%M-%D %h:%m:%s"): string {
        if (format.length == 0) {
            return "";
        }

        let date = new Date(ms);

        return format.replace(/(%Y)|(%M)|(%D)|(%h)|(%m)|(%s)|(%z)/g, (match, Y, M, D, h, m, s, z) => {
            if (Y) {
                return date.getFullYear().toString().padStart(4, "0");
            } else if (M) {
                return (date.getMonth() + 1).toString().padStart(2, "0");
            } else if (D) {
                return date.getDate().toString().padStart(2, "0");
            } else if (h) {
                return date.getHours().toString().padStart(2, "0");
            } else if (m) {
                return date.getMinutes().toString().padStart(2, "0");
            } else if (s) {
                return date.getSeconds().toString().padStart(2, "0");
            } else if (z) {
                return date.getMilliseconds().toString().padStart(3, "0");
            } else {
                return match;
            }
        });
    }

    /**
     * 字符串反格式化为时间
     * @param str
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns
     */
    export function str2date(str: string, format: string = "%Y-%M-%D %h:%m:%s"): Date {
        if (str.length == 0 || format.length == 0) {
            return new Date(0);
        }

        let mIdx = new Map<number, number>();

        let index: number = 1;
        let regFormat: string = format.replace(/(%Y)|(%M)|(%D)|(%h)|(%m)|(%s)|(%z)|(\\)|(\()|(\))|(\[)|(\])|(\{)|(\})|(\^)|(\$)|(\?)|(\+)|(\|)|(\*)/g,
            (match, Y, M, D, h, m, s, z, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13) => {
                if (Y) {
                    mIdx.set(1, index);
                    index++;
                    return "(\\d{4})";
                } else if (M) {
                    mIdx.set(2, index);
                    index++;
                    return "(\\d{2})";
                } else if (D) {
                    mIdx.set(3, index);
                    index++;
                    return "(\\d{2})";
                } else if (h) {
                    mIdx.set(4, index);
                    index++;
                    return "(\\d{2})";
                } else if (m) {
                    mIdx.set(5, index);
                    index++;
                    return "(\\d{2})";
                } else if (s) {
                    mIdx.set(6, index);
                    index++;
                    return "(\\d{2})";
                } else if (z) {
                    mIdx.set(7, index);
                    index++;
                    return "(\\d{3})";
                } else if (x1) {
                    return "\\\\";
                } else if (x2) {
                    return "\\(";
                } else if (x3) {
                    return "\\)";
                } else if (x4) {
                    return "\\[";
                } else if (x5) {
                    return "\\]";
                } else if (x6) {
                    return "\\{";
                } else if (x7) {
                    return "\\}"
                } else if (x8) {
                    return "\\^";
                } else if (x9) {
                    return "\\$";
                } else if (x10) {
                    return "\\?";
                } else if (x11) {
                    return "\\+";
                } else if (x12) {
                    return "\\|";
                } else if (x13) {
                    return "\\*"
                }

                return match;
            });

        let reg = new RegExp(regFormat);
        let result = reg.exec(str);
        if (result == null) {
            return new Date(0);
        }

        let year: number = 0;
        let month: number = 0;
        let day: number = 0;
        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;
        let micsecond: number = 0;
        for (let [p, i] of mIdx) {
            switch (p) {
                case 1: {
                    year = parseInt(result[i]);
                    break;
                }
                case 2: {
                    month = parseInt(result[i]) - 1;
                    break;
                }
                case 3: {
                    day = parseInt(result[i]);
                    break;
                }
                case 4: {
                    hour = parseInt(result[i]);
                    break;
                }
                case 5: {
                    minute = parseInt(result[i]);
                    break;
                }
                case 6: {
                    second = parseInt(result[i]);
                    break;
                }
                case 7: {
                    micsecond = parseInt(result[i]);
                    break;
                }
                default:
                    break;
            }
        }

        return new Date(year, month, day, hour, minute, second, micsecond);
    }

    /**
     * 字符串反格式化为时间
     * @param str
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns
     */
    export function str2time(str: string, format: string = "%Y-%M-%D %h:%m:%s"): number {
        let dt = str2date(str, format).getTime();
        return dt;
    }

    /**
     * 当前时间格式化为时间
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns 
     */
    export function now2str(format: string = "%Y-%M-%D %h:%m:%s"): string {
        return time2str(Date.now(), format);
    }

    /**
     * 获取当前年份
     * @param ms
     * @returns 9999
     */
    export function getYear(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getFullYear();
        return Math.max(1970, Math.min(9999, cur));
    }

    /**
     * 获取下一年
     * @param ms
     * @returns [1970, 9999]
     */
    export function getNextYear(ms: number): number {
        let cur = getYear(ms);
        if (cur >= 9999) {
            return 9999;
        } else if (cur < 1970) {
            return 1970;
        }
        return cur + 1;
    }

    /**
     * 获取上一年
     * @param ms
     * @returns [1970, 9999]
     */
    export function getPrevYear(ms: number): number {
        let cur = getYear(ms);
        if (cur > 9999) {
            return 9999;
        } else if (cur <= 1970) {
            return 1970;
        }
        return cur - 1;
    }

    /**
     * 获取当前月份
     * @param ms
     * @returns 202201
     */
    export function getMonth(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getFullYear() * 100 + (dt.getMonth() + 1);
        return Math.max(197001, Math.min(999912, cur));
    }

    /**
     * 获取下一月
     * @param ms
     * @returns [197001, 999912]
     */
    export function getNextMonth(ms: number): number {
        let cur = getMonth(ms);
        if (cur >= 999912) {
            return 999912;
        } else if (cur < 197001) {
            return 197001;
        }

        let year = Math.floor(cur / 100);
        let month = cur % 100;

        if (month >= 12) {
            year += 1;
            month = 1;
        } else {
            month += 1;
        }

        return year * 100 + month;
    }

    /**
     * 获取上一月
     * @param ms
     * @returns [197001, 999912]
     */
    export function getPrevMonth(ms: number): number {
        let cur = getMonth(ms);
        if (cur > 999912) {
            return 999912;
        } else if (cur <= 197001) {
            return 197001;
        }

        let year = Math.floor(cur / 100);
        let month = cur % 100;

        if (month <= 1) {
            year -= 1;
            month = 12;
        } else {
            month -= 1;
        }

        return year * 100 + month;
    }

    /**
     * 获取当前日期
     * @param ms
     * @returns 20220103
     */
    export function getDay(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取下一天
     * @param ms
     * @returns [19700101, 99991231]
     */
    export function getNextDay(ms: number): number {
        let cur = getDay(ms + 86400000);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取上一天
     * @param ms
     * @returns [19700101, 99991231]
     */
    export function getPrevDay(ms: number): number {
        let cur = getDay(ms - 86400000);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获得当前月有多少天
     */
    export function getCurMonthDays(ms: number) {
        return getPrevDay(str2time((getNextMonth(ms) * 100 + 1).toString(), "%Y%M%D")) % 100;
    }

    /**
     * 获取两天之间的时间间隔
     * @param startMs
     * @param endMs
     */
    export function getDayDiff(startMs: number, endMs: number): number {
        if (endMs < startMs || startMs < 0 || endMs < 0) {
            return -1;
        }

        let startDate = getDay(startMs);
        let endDate = getDay(endMs);
        let startZeroMs = str2time(startDate.toString(), "%Y%M%D");
        let endZeroMs = str2time(endDate.toString(), "%Y%M%D");

        return Math.floor((endZeroMs - startZeroMs) / (86400 * 1000))
    }
} // namespace sz
