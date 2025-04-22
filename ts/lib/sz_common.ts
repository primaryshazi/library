import { SZDEF } from "./sz_define";

export namespace SZCOMMON {
    // 条件比较函数 返回-1、0、1
    export type Compare<T> = (a: T, b: T) => number;

    /**
     * 小优先比较函数
     * @param a
     * @param b
     * @returns 0:a等于b; -1:a小于b; 1:a大于b
     */
    export function less<T>(a: T, b: T): number {
        if (a == b) {
            return 0;
        }

        return a < b ? -1 : 1;
    }

    /**
     * 大优先比较函数
     * @param a
     * @param b
     * @returns 0:a等于b; -1:a大于b; 1:a小于b
     */
    export function greater<T>(a: T, b: T): number {
        if (a == b) {
            return 0;
        }

        return a > b ? -1 : 1;
    }

    /**
     * 二分法搜索
     * @param arr
     * @param target
     * @param compare 0:a等于b; -1:a小于b; 1:a大于b
     * @returns -1:未找到 >=0:找到
     */
    export function binarySearch<T>(arr: T[], target: T, compare: Compare<T> = less): number {
        let left = 0;
        let right = arr.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            let cond = compare(arr[mid], target);
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

    /**
     * 判断数组是否有序
     * @param array
     * @param compare
     * @returns
     */
    export function isSorted<T>(array: T[], compare: Compare<T> = less): boolean {
        for (let i = 0; i < array.length - 1; i++) {
            if (compare(array[i], array[i + 1]) > 0) {
                return false;
            }
        }
        return true;
    };

    /**
     * 生成范围内的随机数 [min, max)
     * @param min
     * @param max
     * @returns
     */
    export function randRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * 数字转换为携带单位的字符串
     * @param num
     * @param fixedPoint
     * @returns
     */
    export function number2UnitStr(num: number, fixedPoint: number = 1): string {
        let digit: number = 0;
        let suffix: string = "";

        if (num < SZDEF.THOUSAND_MULTIPLE) {
            digit = 0;
            suffix = "";
        } else if (num < SZDEF.MILLION_MULTIPLE) {
            digit = 3;
            suffix = "K";
        } else if (num < SZDEF.BILLION_MULTIPLE) {
            digit = 6;
            suffix = "M";
        } else if (num < SZDEF.TRILLION_MULTIPLE) {
            digit = 9;
            suffix = "G";
        } else if (num < SZDEF.QUADRILLION_MULTIPLE) {
            digit = 12;
            suffix = "T";
        } else {
            digit = 15;
            suffix = "P";
        }

        return (Math.floor(num / Math.pow(10, digit - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + suffix;
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
     * 洗牌打乱
     * @param array
     * @param gen [0, 1)
     */
    export function shuffle<T>(array: T[], gen: () => number = () => Math.random()) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(gen() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * 角度转弧度
     * @param angle
     * @returns
     */
    export function angle2Radian(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * 弧度转角度
     * @param radian
     * @returns
     */
    export function radian2Angle(radian: number): number {
        return radian * 180 / Math.PI;
    }

    /**
     * 判断两个数组是否相同
     * @param a
     * @param b
     * @returns
     */
    export function isSameArray<T>(a: Array<T>, b: Array<T>): boolean {
        if (a.length != b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 平均分布整数
     * @param value 目标值
     * @param num 数量
     * @param offsetRatio 波动比例
     * @returns 结果数组
     */
    export function distributeInteger(value: number, num: number, offsetRatio: number = 0.1): Array<number> {
        value = Math.max(1, Math.floor(value));
        num = Math.max(1, Math.floor(num));
        offsetRatio = Math.max(0, Math.min(1, offsetRatio));

        if (num >= value) {
            return new Array<number>(num).fill(1);
        }

        let result = new Array<number>();
        for (let i = 0; i < num; i++) {
            let avg = value / num;
            let v = avg * (1 - offsetRatio + offsetRatio * 2 * Math.random());
            if (Math.random() < 0.5) {
                result.push(Math.floor(v));
            } else {
                result.push(Math.ceil(v));
            }
        }

        while (true) {
            let diff = result.reduce((a, b) => a + b, 0) - value;
            let step = Math.max(1, Math.abs(Math.floor(diff / num)));

            if (diff > 0) {
                result.sort((a, b) => b - a);
                for (let i = 0; i < result.length && diff > 0; i++) {
                    if (result[i] > step) {
                        result[i] -= step;
                        diff -= step;
                    }
                }
            } else if (diff < 0) {
                result.sort((a, b) => a - b);
                for (let i = 0; i < result.length && diff < 0; i++) {
                    result[i] += step;
                    diff += step;
                }
            } else {
                break;
            }
        }

        SZCOMMON.shuffle(result);

        return result;
    }

    /**
     * 深拷贝
     * @param value
     * @returns
     */
    export function deepClone<T>(value: T): T {
        // 空
        if (!value) {
            return value;
        }

        // 数组
        if (Array.isArray(value)) {
            return value.map((item) => SZCOMMON.deepClone(item)) as unknown as T;
        }

        // 日期
        if (value instanceof Date) {
            return new Date(value) as unknown as T;
        }

        // 普通对象
        if (typeof value === 'object') {
            let pObject = value as Object;
            let pValue = Object.fromEntries(
                Object.entries(value).map(([k, v]: [string, any]) => {
                    return [k, SZCOMMON.deepClone(v)];
                })
            ) as unknown as T;
            Object.setPrototypeOf(pValue, Object.getPrototypeOf(pObject));
            return pValue;
        }

        // 基本类型
        return value;
    }

    /**
     * 裁剪字符串
     * @param str
     * @param chars
     * @returns
     */
    export function trimString(str: string, chars: string = ' \t\n\r\f\v'): string {
        let start = 0;
        let end = str.length;

        // 从左边裁剪
        while (start < end && chars.indexOf(str[start]) >= 0) {
            start++;
        }

        // 从右边裁剪
        while (end > start && chars.indexOf(str[end - 1]) >= 0) {
            end--;
        }

        return str.slice(start, end);
    }
} // namespace szcommon
