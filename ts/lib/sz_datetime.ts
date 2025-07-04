export namespace SZDATE {
    /**
     * 获取单调时间
     * @returns 毫秒
     */
    export function steadyMs(): number {
        return Math.floor(performance.now());
    }

    /**
     * 倒计时格式化
     * @param ms
     * @param format %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @param isFillZero 是否填充0
     * @returns 格式化后的字符串
     */
    export function countdownFormat(ms: number, format: string = "%D %h:%m:%s", isFillZero: boolean = true): string {
        if (format.length == 0) {
            return "";
        }

        const sec = Math.floor(ms / 1000);
        const components: { [key: string]: { str: string, length: number } } = {
            "D": { str: `${Math.floor(sec / 86400)}`, length: 1 },
            "h": { str: `${Math.floor(sec % 86400 / 3600)}`, length: 2 },
            "m": { str: `${Math.floor(sec % 3600 / 60)}`, length: 2 },
            "s": { str: `${sec % 60}`, length: 2 },
            "z": { str: `${ms % 1000}`, length: 3 },
        };

        let result = "";
        let i = 0;

        while (i < format.length) {
            if (format[i] === '%' && i + 1 < format.length) {
                let ch = format[i + 1];
                switch (ch) {
                    case 'D':
                    case 'h':
                    case 'm':
                    case 's':
                    case 'z': {
                        const value = components[ch];
                        if (isFillZero) {
                            result += `${value.str}`.padStart(value.length, "0");
                        } else {
                            result += `${value.str}`;
                        }

                        i += 2;
                        break;
                    }
                    default: {
                        result += format[i];
                        i++;
                        break;
                    }
                }
            } else {
                result += format[i];
                i++;
            }
        }

        return result;
    }

    /**
     * 时间格式化为字符串
     * @param ms
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns 格式化后的字符串
     */
    export function time2str(ms: number, format: string = "%Y-%M-%D %h:%m:%s"): string {
        if (format.length === 0) {
            return "";
        }

        const date = new Date(ms);

        const components: { [key: string]: { str: string, length: number } } = {
            "Y": { str: `${date.getFullYear()}`, length: 4 },
            "M": { str: `${date.getMonth() + 1}`, length: 2 },
            "D": { str: `${date.getDate()}`, length: 2 },
            "h": { str: `${date.getHours()}`, length: 2 },
            "m": { str: `${date.getMinutes()}`, length: 2 },
            "s": { str: `${date.getSeconds()}`, length: 2 },
            "z": { str: `${date.getMilliseconds()}`, length: 3 },
        };

        let result = "";
        let i = 0;

        while (i < format.length) {
            if (format[i] === '%' && i + 1 < format.length) {
                let ch = format[i + 1];
                switch (ch) {
                    case 'Y':
                    case 'M':
                    case 'D':
                    case 'h':
                    case 'm':
                    case 's':
                    case 'z': {
                        const value = components[ch];
                        result += `${value.str}`.padStart(value.length, "0");

                        i += 2;
                        break;
                    }
                    default: {
                        result += format[i];
                        i++;
                        break;
                    }
                }
            } else {
                result += format[i];
                i++;
            }
        }

        return result;
    }

    /**
     * 字符串反格式化为时间
     * @param str
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns Date
     */
    export function str2date(str: string, format: string = "%Y-%M-%D %h:%m:%s"): Date {
        if (str.length == 0 || format.length == 0) {
            return new Date(0);
        }

        let idxs = [0, 0, 0, 0, 0, 0, 0];

        let index: number = 1;
        let regFormat: string = format.replace(/(%Y)|(%M)|(%D)|(%h)|(%m)|(%s)|(%z)|([\\\/\|\!\$\^\*\(\)\[\]\{\}\!\?\.\+])/g,
            (match, Y, M, D, h, m, s, z, x) => {
                if (Y) {
                    idxs[0] = index;
                    index++;
                    return "(\\d{4})";
                } else if (M) {
                    idxs[1] = index;
                    index++;
                    return "(\\d{2})";
                } else if (D) {
                    idxs[2] = index;
                    index++;
                    return "(\\d{2})";
                } else if (h) {
                    idxs[3] = index;
                    index++;
                    return "(\\d{2})";
                } else if (m) {
                    idxs[4] = index;
                    index++;
                    return "(\\d{2})";
                } else if (s) {
                    idxs[5] = index;
                    index++;
                    return "(\\d{2})";
                } else if (z) {
                    idxs[6] = index;
                    index++;
                    return "(\\d{3})";
                } else if (x) {
                    return `\\${x}`;
                }

                return match;
            });

        let reg = new RegExp(regFormat);
        let result = reg.exec(str);
        if (result == null) {
            return new Date(0);
        }

        let year: number = idxs[0] >= 1 ? parseInt(result[idxs[0]]) : 0;
        let month: number = idxs[1] >= 1 ? parseInt(result[idxs[1]]) - 1 : 0;
        let day: number = idxs[2] >= 1 ? parseInt(result[idxs[2]]) : 0;
        let hour: number = idxs[3] >= 1 ? parseInt(result[idxs[3]]) : 0;
        let minute: number = idxs[4] >= 1 ? parseInt(result[idxs[4]]) : 0;
        let second: number = idxs[5] >= 1 ? parseInt(result[idxs[5]]) : 0;
        let micsecond: number = idxs[6] >= 1 ? parseInt(result[idxs[6]]) : 0;

        return new Date(year, month, day, hour, minute, second, micsecond);
    }

    /**
     * 字符串反格式化为时间
     * @param str
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns 毫秒
     */
    export function str2time(str: string, format: string = "%Y-%M-%D %h:%m:%s"): number {
        let dt = SZDATE.str2date(str, format).getTime();
        return dt;
    }

    /**
     * 当前时间格式化为时间
     * @param format %Y:年 %M:月 %D:日 %h:时 %m: 分 %s:秒 %z:毫秒
     * @returns 格式化后的字符串
     */
    export function now2str(format: string = "%Y-%M-%D %h:%m:%s"): string {
        return SZDATE.time2str(Date.now(), format);
    }

    /**
     * 获取当前年份
     * @param ms
     * @returns [1970, 9999]
     */
    export function getYear(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getFullYear();
        return Math.max(1970, Math.min(9999, cur));
    }

    /**
     * 获取下一年
     * @param ms
     * @param next >0: 下N年  <0: 上N年
     * @returns [1970, 9999]
     */
    export function getNextYear(ms: number, next: number = 1): number {
        if (next == 0) {
            return SZDATE.getYear(ms);
        } else if (next < 0) {
            return SZDATE.getPrevYear(ms, -next);
        }

        let nextYear = SZDATE.getYear(ms) + next;
        if (nextYear >= 9999) {
            return 9999;
        } else if (nextYear < 1970) {
            return 1970;
        }
        return nextYear;
    }

    /**
     * 获取上一年
     * @param ms
     * @param prev >0: 上N年  <0: 下N年
     * @returns [1970, 9999]
     */
    export function getPrevYear(ms: number, prev: number = 1): number {
        if (prev == 0) {
            return SZDATE.getYear(ms);
        } else if (prev < 0) {
            return SZDATE.getNextYear(ms, -prev);
        }

        let prevYear = SZDATE.getYear(ms) - prev;
        if (prevYear > 9999) {
            return 9999;
        } else if (prevYear <= 1970) {
            return 1970;
        }
        return prevYear;
    }

    /**
     * 获取当前月份
     * @param ms
     * @returns [197001, 999912]
     */
    export function getMonth(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getFullYear() * 100 + (dt.getMonth() + 1);
        return Math.max(197001, Math.min(999912, cur));
    }

    /**
     * 获取下一月
     * @param ms
     * @param next >0: 下N月  <0: 上N月
     * @returns [197001, 999912]
     */
    export function getNextMonth(ms: number, next: number = 1): number {
        if (next == 0) {
            return SZDATE.getMonth(ms);
        } else if (next < 0) {
            return SZDATE.getPrevMonth(ms, -next);
        }

        let cur = SZDATE.getMonth(ms);

        let year = Math.floor(cur / 100);
        let month = cur % 100;

        let addYear = Math.floor(next / 12);
        let addMonth = next % 12;

        if (month + addMonth > 12) {
            year += addYear + 1;
            month = month + addMonth - 12;
        } else {
            year += addYear;
            month += addMonth;
        }

        let nextMonth = year * 100 + month;
        if (nextMonth > 999912) {
            return 999912;
        } else if (nextMonth <= 197001) {
            return 197001;
        }

        return nextMonth;
    }

    /**
     * 获取上一月
     * @param ms
     * @param prev >0: 上N月  <0: 下N月
     * @returns [197001, 999912]
     */
    export function getPrevMonth(ms: number, prev: number = 1): number {
        if (prev == 0) {
            return SZDATE.getMonth(ms);
        } else if (prev < 0) {
            return SZDATE.getNextMonth(ms, -prev);
        }

        let cur = SZDATE.getMonth(ms);

        let year = Math.floor(cur / 100);
        let month = cur % 100;

        let addYear = Math.floor(prev / 12);
        let addMonth = prev % 12;

        if (month - addMonth < 1) {
            year -= addYear + 1;
            month = month - addMonth + 12;
        } else {
            year -= addYear;
            month -= addMonth;
        }

        let nextMonth = year * 100 + month;
        if (nextMonth > 999912) {
            return 999912;
        } else if (nextMonth <= 197001) {
            return 197001;
        }

        return nextMonth;
    }

    /**
     * 获取当前日期
     * @param ms
     * @returns [19700101, 99991231]
     */
    export function getDay(ms: number): number {
        const dt = new Date(ms);
        const cur = dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取下一天
     * @param ms
     * @param next >0: 下N天  <0: 上N天
     * @returns [19700101, 99991231]
     */
    export function getNextDay(ms: number, next: number = 1): number {
        const cur = SZDATE.getDay(ms + 86400000 * next);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取上一天
     * @param ms
     * @param prev >0: 上N天  <0: 下N天
     * @returns [19700101, 99991231]
     */
    export function getPrevDay(ms: number, prev: number = 1): number {
        const cur = SZDATE.getDay(ms - 86400000 * prev);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取周一的日期
     * @param ms
     * @returns [19700101, 99991231]
     */
    export function getMonday(ms: number): number {
        const date = new Date(ms);
        const week = date.getDay();
        if (week == 1) {
            return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
        }

        return SZDATE.getPrevDay(ms, week == 0 ? 6 : week - 1);
    }

    /**
     * 获得当前月有多少天
     * @param ms
     * @returns [28, 31]
     */
    export function getMonthDays(ms: number): number {
        const date = new Date(ms);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const days = new Date(year, month, 0).getDate();
        return days;
    }

    /**
     * 获取两天之间的时间间隔
     * @param startMs
     * @param endMs
     * @returns [-1, ~]
     */
    export function getDayDiff(startMs: number, endMs: number): number {
        const diffMs = endMs - startMs;
        return Math.floor(diffMs / 86400000);
    }
} // namespace SZDATE
