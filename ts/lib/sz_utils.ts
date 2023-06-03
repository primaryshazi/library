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
    * 时间格式化为字符串 %Y-%M-%D %h:%m:%s.%z
    * @param ms
    * @param format
    * @returns
    */
    export function time2str(ms: number, format: string = "%Y-%M-%D %h:%m:%s.%z"): string {
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
    * 字符串反格式化为时间 %Y-%M-%D %h:%m:%s.%z
    * @param str
    * @param format
    * @returns
    */
    export function str2date(str: string, format: string = "%Y-%M-%D %h:%m:%s.%z"): Date {
        if (str.length == 0 || format.length == 0) {
            return new Date(0);
        }

        let mapIndex = new Map<number, number>();

        let index: number = 1;
        let regFormat: string = format.replace(/(%Y)|(%M)|(%D)|(%h)|(%m)|(%s)|(%z)|(\()|(\))|(\\)|(\[)|(\])|(\^)|(\$)|(\?)|(\+)|(\|)/g,
            (match, Y, M, D, h, m, s, z, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10) => {
                if (Y) {
                    mapIndex.set(1, index);
                    index++;
                    return "(\\d{4})";
                } else if (M) {
                    mapIndex.set(2, index);
                    index++;
                    return "(\\d{2})";
                } else if (D) {
                    mapIndex.set(3, index);
                    index++;
                    return "(\\d{2})";
                } else if (h) {
                    mapIndex.set(4, index);
                    index++;
                    return "(\\d{2})";
                } else if (m) {
                    mapIndex.set(5, index);
                    index++;
                    return "(\\d{2})";
                } else if (s) {
                    mapIndex.set(6, index);
                    index++;
                    return "(\\d{2})";
                } else if (z) {
                    mapIndex.set(7, index);
                    index++;
                    return "(\\d{3})";
                } else if (x1) {
                    return "\\(";
                } else if (x2) {
                    return "\\)";
                } else if (x3) {
                    return "\\\\";
                } else if (x4) {
                    return "\\[";
                } else if (x5) {
                    return "\\]";
                } else if (x6) {
                    return "\\^";
                } else if (x7) {
                    return "\\$";
                } else if (x8) {
                    return "\\?";
                } else if (x9) {
                    return "\\+";
                } else if (x10) {
                    return "\\|";
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
        for (let [p, i] of mapIndex) {
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
    * 字符串反格式化为时间 %Y-%M-%D %h:%m:%s.%z
    * @param str
    * @param format
    * @returns
    */
    export function str2time(str: string, format: string = "%Y-%M-%D %h:%m:%s.%z"): number {
        let dt = str2date(str, format).getTime();
        return dt;
    }

    /**
     * 以{d}这种形式来替换字符串，{0}表示第一个参数 {1}表示第二个参数，依次类推
     * @param str
     * @param args
     */
    export function stringFormat(str: string, ...args: any[]) {
        for (let i = 0; i < args.length; i++) {
            let pattern = new RegExp("\\{" + i + "\\}", "g")
            str = str.replace(pattern, args[i].toString());
        }
        return str;
    }

    /**
     * 比较函数
     * @param a
     * @param b
     * @returns 0:a等于b; -1:a小于b; 1:a大于b
     */
    export function compareCondition<T>(a: T, b: T): number {
        if (a === b) {
            return 0;
        } else if (a < b) {
            return -1;
        } else {
            return 1;
        }
    }

    /**
     * 二分法搜索
     * @param arr
     * @param target
     * @param conditon 0:a等于b; -1:a小于b; 1:a大于b
     * @returns -1:未找到 >0:找到
     */
    export function binarySearch<T>(arr: T[], target: T, conditon: (a: T, b: T) => number = szutils.compareCondition): number {
        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            let cond = conditon(arr[mid], target);
            if (0 == cond) {
                return mid;
            } else if (-1 == cond) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }
}