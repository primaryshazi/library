import { szdefine } from "./sz_define";

export namespace szutils {
    /**
     * 数字转换为携带单位的字符串
     * @param num 
     * @param fixedPoint 
     * @returns 
     */
    export function number2UnitStr(num: number, fixedPoint: number = 1): string {
        if (num < szdefine.NUM_KILOS) {
            return num.toString();
        } else if (num < szdefine.NUM_MILLION) {
            return (Math.floor(num / Math.pow(10, 3 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "K";
        } else if (num < szdefine.NUM_BILLON) {
            return (Math.floor(num / Math.pow(10, 6 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "M";
        } else if (num < szdefine.NUM_TRILLON) {
            return (Math.floor(num / Math.pow(10, 9 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "G";
        } else if (num < szdefine.NUM_QUADRILLON) {
            return (Math.floor(num / Math.pow(10, 12 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "T";
        } else {
            return (Math.floor(num / Math.pow(10, 15 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "P";
        }
    }


    /**
     * 获得某一个比特位的值 [0, 32]
     * @param num
     * @param index 从0开始
     * @returns
     */
    export function getBitValue(num: number, index: number): number {
        return (num >> index) & 1;
    }

    /**
     * 设置某一个比特位的值 [0, 32]
     * @param num
     * @param index
     * @returns
     */
    export function setBitValue(num: number, index: number, flag: number): number {
        let value = 1 << index;
        if (flag == 0) {
            num &= ~value;
        } else {
            num |= value;
        }
        return num;
    }

    /**
     * 获得某一区间比特位的值 [0, 32]
     * @param num
     * @param index 从0开始
     * @returns
     */
    export function getBitSec(num: number, beg: number, end: number): number {
        return Number(getBitSecBigInt(BigInt(num), beg, end));
    }

    /**
     * 设置某一区间比特位的值 [0, 32]
     * @param num
     * @param beg
     * @param end
     * @param flag
     * @returns
     */
    export function setBitSec(num: number, beg: number, end: number, flag: number): number {
        return Number(setBitSecBigInt(BigInt(num), beg, end, flag));
    }

    /**
     * 获得某一个比特位的值 [0, 1024]
     * @param num
     * @param index 从0开始
     * @returns 返回指定位的值
     */
    export function getBitValueBigInt(num: bigint, index: number): number {
        return Number((num >> BigInt(index)) & BigInt(1));
    }

    /**
     * 设置某一个比特位的值 [0, 1024]
     * @param num
     * @param index 从0开始
     * @returns 返回修改后的num
     */
    export function setBitValueBigInt(num: bigint, index: number, flag: number): bigint {
        let value: bigint = BigInt(0x01) << BigInt(index);
        if (flag == 0) {
            num &= ~value;
        } else {
            num |= value;
        }
        return num;
    }

    /**
     * 获得某一区间比特位的值 [0, 1024]
     * @param num
     * @param index 从0开始
     * @returns
     */
    export function getBitSecBigInt(num: bigint, beg: number, end: number): bigint {
        let one = BigInt(0x01);
        let bbeg = BigInt(beg);
        let bend = BigInt(end);
        return (num >> bbeg) & ((one << (bend - bbeg + one)) - one);
    }

    /**
     * 设置某一区间比特位的值 [0, 1024]
     * @param num
     * @param beg
     * @param end
     * @param flag
     * @returns
     */
    export function setBitSecBigInt(num: bigint, beg: number, end: number, flag: number): bigint {
        let one = BigInt(0x01);
        let bbeg = BigInt(beg);
        let bend = BigInt(end);
        let value = beg == end ? (one << bbeg) : (((one << bbeg) - one) ^ ((one << bend + one) - one));
        if (flag == 0) {
            num &= ~value;
        } else {
            num |= value;
        }
        return num;
    }

    /**
     * 获取整数指定位的值
     * @param num
     * @param index >= 0
     * @returns
     */
    export function getIntValue(num: number, index: number): number {
        num = Math.floor(num);
        index = Math.floor(index);
        if (index < 0) {
            return num;
        }

        let digit = 10 ** index;
        num = Math.abs(num);
        return Math.floor(num / digit) % 10;
    }

    /**
     * 设置整数指定位的值
     * @param num
     * @param index >= 0
     * @param value [0, 9]
     * @returns
     */
    export function setIntValue(num: number, index: number, value: number): number {
        num = Math.floor(num);
        index = Math.floor(index);
        value = Math.floor(index);
        if (index < 0 || value < 0 || value > 9) {
            return num;
        }

        let sym = num >= 0 ? 1 : -1;
        num = Math.abs(num);
        let digit = 10 ** (index + 1);
        let frontPart = Math.floor(num / digit) * digit;
        let backPart = Math.floor(num % (digit / 10));
        let newData = frontPart + value * (digit / 10) + backPart;

        return sym * newData;
    }

    /**
     * 以{d}这种形式来替换字符串，{0}表示第一个参数 {1}表示第二个参数，依次类推
     * @param str
     * @param args
     */
    export function stringFormat(str: string, ...args: any[]) {
        return str.replace(/\{(\d+)\}/g, (match, index) => {
            return typeof args[index] !== "undefined" ? args[index] : match;
        });
    }

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
                return date.getUTCFullYear().toString().padStart(4, "0");
            } else if (M) {
                return (date.getUTCMonth() + 1).toString().padStart(2, "0");
            } else if (D) {
                return date.getUTCDate().toString().padStart(2, "0");
            } else if (h) {
                return date.getUTCHours().toString().padStart(2, "0");
            } else if (m) {
                return date.getUTCMinutes().toString().padStart(2, "0");
            } else if (s) {
                return date.getUTCSeconds().toString().padStart(2, "0");
            } else if (z) {
                return date.getUTCMilliseconds().toString().padStart(3, "0");
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

        return new Date(Date.UTC(year, month, day, hour, minute, second, micsecond));
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
     * 获取当前年份
     * @param ms
     * @returns 9999
     */
    export function getYear(ms: number): number {
        let dt = new Date(ms);
        let cur = dt.getUTCFullYear();
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
        let cur = dt.getUTCFullYear() * 100 + (dt.getUTCMonth() + 1);
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
        let cur = dt.getUTCFullYear() * 10000 + (dt.getUTCMonth() + 1) * 100 + dt.getUTCDate();
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
} // namespace szutils
