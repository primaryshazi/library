export namespace SZDATE {
    /**
     * 获取单调时间
     * @returns
     */
    export function steadyMs(): number {
        return performance.now() | 0;
    }

    /**
     * 倒计时格式化
     * @param ms
     * @param format %DD:日 %hh:时 %mm: 分 %ss:秒 %zzz:毫秒
     * @returns
     */
    export function countdownFormat(ms: number, format: string = "%DD %hh:%mm:%ss") {
        if (format.length == 0) {
            return "";
        }

        const s = Math.floor(ms / 1000);

        let day = Math.floor(s / 86400);
        let hour = Math.floor(s % 86400 / 3600);
        let min = Math.floor(s % 3600 / 60);
        let second = s % 60;
        let micsecond = ms % 1000;

        return format.replace(/(%D{1,2})|(%h{1,2})|(%m{1,2})|(%s{1,2})|(%z{1,3})/g, (match, D, h, m, s, z) => {
            if (D) {
                return day.toString().padStart(D.length - 1, "0");
            } else if (h) {
                return hour.toString().padStart(h.length - 1, "0");
            } else if (m) {
                return min.toString().padStart(m.length - 1, "0");
            } else if (s) {
                return second.toString().padStart(s.length - 1, "0");
            } else if (z) {
                return micsecond.toString().padStart(z.length - 1, "0");
            } else {
                return match;
            }
        });
    }

    /**
     * 时间格式化为字符串
     * @param ms
     * @param format %YYYY:年 %MM:月 %DD:日 %hh:时 %mm: 分 %ss:秒 %zzz:毫秒
     * @returns
     */
    export function time2str(ms: number, format: string = "%YYYY-%MM-%DD %hh:%mm:%ss"): string {
        if (format.length == 0) {
            return "";
        }

        let date = new Date(ms);

        return format.replace(/(%Y{1,4})|(%M{1,2})|(%D{1,2})|(%h{1,2})|(%m{1,2})|(%s{1,2})|(%z{1,3})/g, (match, Y, M, D, h, m, s, z) => {
            if (Y) {
                return date.getFullYear().toString().padStart(Y.length - 1, "0");
            } else if (M) {
                return (date.getMonth() + 1).toString().padStart(M.length - 1, "0");
            } else if (D) {
                return date.getDate().toString().padStart(D.length - 1, "0");
            } else if (h) {
                return date.getHours().toString().padStart(h.length - 1, "0");
            } else if (m) {
                return date.getMinutes().toString().padStart(m.length - 1, "0");
            } else if (s) {
                return date.getSeconds().toString().padStart(s.length - 1, "0");
            } else if (z) {
                return date.getMilliseconds().toString().padStart(z.length - 1, "0");
            } else {
                return match;
            }
        });
    }

    /**
     * 字符串反格式化为时间
     * @param str
     * @param format %YYYY:年 %MM:月 %DD:日 %hh:时 %mm: 分 %ss:秒 %zzz:毫秒
     * @returns
     */
    export function str2date(str: string, format: string = "%YYYY-%MM-%DD %hh:%mm:%ss"): Date {
        if (str.length == 0 || format.length == 0) {
            return new Date(0);
        }

        let idxs = [0, 0, 0, 0, 0, 0, 0];

        let index: number = 1;
        let regFormat: string = format.replace(/(%Y{1,4})|(%M{1,2})|(%D{1,2})|(%h{1,2})|(%m{1,2})|(%s{1,2})|(%z{1,3})|(\\)|(\()|(\))|(\[)|(\])|(\{)|(\})|(\^)|(\$)|(\?)|(\+)|(\|)|(\*)|(\.)/g,
            (match, Y, M, D, h, m, s, z, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14) => {
                if (Y) {
                    idxs[0] = index;
                    index++;
                    return "(\\d{1,4})";
                } else if (M) {
                    idxs[1] = index;
                    index++;
                    return "(\\d{1,2})";
                } else if (D) {
                    idxs[2] = index;
                    index++;
                    return "(\\d{1,2})";
                } else if (h) {
                    idxs[3] = index;
                    index++;
                    return "(\\d{1,2})";
                } else if (m) {
                    idxs[4] = index;
                    index++;
                    return "(\\d{1,2})";
                } else if (s) {
                    idxs[5] = index;
                    index++;
                    return "(\\d{1,2})";
                } else if (z) {
                    idxs[6] = index;
                    index++;
                    return "(\\d{1,3})";
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
                } else if (x14) {
                    return "\\."
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
     * @param format %YYYY:年 %MM:月 %DD:日 %hh:时 %mm: 分 %ss:秒 %zzz:毫秒
     * @returns
     */
    export function str2time(str: string, format: string = "%YYYY-%MM-%DD %hh:%mm:%ss"): number {
        let dt = SZDATE.str2date(str, format).getTime();
        return dt;
    }

    /**
     * 当前时间格式化为时间
     * @param format %YYYY:年 %MM:月 %DD:日 %hh:时 %mm: 分 %ss:秒 %zzz:毫秒
     * @returns
     */
    export function now2str(format: string = "%YYYY-%MM-%DD %hh:%mm:%ss"): string {
        return SZDATE.time2str(Date.now(), format);
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
     * @param next >0: 下N天  <0: 上N天
     * @returns [19700101, 99991231]
     */
    export function getNextDay(ms: number, next: number = 1): number {
        let cur = SZDATE.getDay(ms + 86400000 * next);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获取上一天
     * @param ms
     * @param prev >0: 上N天  <0: 下N天
     * @returns [19700101, 99991231]
     */
    export function getPrevDay(ms: number, prev: number = 1): number {
        let cur = SZDATE.getDay(ms - 86400000 * prev);
        return Math.max(19700101, Math.min(99991231, cur));
    }

    /**
     * 获得当前是周几
     * @returns [1-7] => 1:周一, 2:周二, 3:周三, 4:周四, 5:周五, 6:周六 7:周日
     */
    export function getDateWeek(ms: number): number {
        const date = new Date(ms);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 3) {
            month += 12;
            year--;
        }

        const c = Math.floor(year / 100);
        const y = year % 100;
        const m = month;
        const d = day;
        const w = (y + Math.floor(y / 4) + Math.floor(c / 4) - 2 * c + Math.floor(26 * (m + 1) / 10) + d - 1) % 7;

        return [7, 1, 2, 3, 4, 5, 6][w];
    }

    /**
     * 获取周一的日期
     * @param ms
     * @returns
     */
    export function getMondayDate(ms: number): number {
        let cur_week = SZDATE.getDateWeek(ms);
        if (cur_week == 1) {
            return SZDATE.getDay(ms);
        }

        return SZDATE.getPrevDay(ms, cur_week - 1);
    }

    /**
     * 获得当前月有多少天
     * @param ms
     */
    export function getMonthDays(ms: number) {
        return SZDATE.getPrevDay(SZDATE.str2time((SZDATE.getNextMonth(ms) * 100 + 1).toString(), "%YY%MM%DD")) % 100;
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

        let startDate = new Date(startMs);
        let endDate = new Date(endMs);
        let startZeroMs = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
        let endZeroMs = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

        return Math.floor((endZeroMs - startZeroMs) / 86400000);
    }
} // namespace sz
