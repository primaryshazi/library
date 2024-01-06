import { szdefine } from "./sz_define";

export namespace szcommon {
    // 条件比较函数 返回-1、0、1
    export type conditonCompare<T> = (a: T, b: T) => number;

    export function isValidValue<T>(value: T): boolean {
        return value != undefined && value != null;
    }

    /**
     * 小优先比较函数
     * @param a
     * @param b
     * @returns 0:a等于b; -1:a小于b; 1:a大于b
     */
    export function lessCompare<T>(a: T, b: T): number {
        if (a == b) {
            return 0;
        }

        if (!isValidValue(a)) {
            return -1;
        }

        if (!isValidValue(b)) {
            return 1;
        }

        return a < b ? -1 : 1;
    }

    /**
     * 大优先比较函数
     * @param a
     * @param b
     * @returns 0:a等于b; -1:a大于b; 1:a小于b
     */
    export function greaterCompare<T>(a: T, b: T): number {
        if (a == b) {
            return 0;
        }

        if (!isValidValue(a)) {
            return 1;
        }

        if (!isValidValue(b)) {
            return -1;
        }

        return a > b ? -1 : 1;
    }

    /**
     * 二分法搜索
     * @param arr
     * @param target
     * @param compare 0:a等于b; -1:a小于b; 1:a大于b
     * @returns -1:未找到 >0:找到
     */
    export function binarySearch<T>(arr: T[], target: T, compare: conditonCompare<T> = lessCompare): number {
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
    export function isSorted<T>(array: T[], compare: conditonCompare<T> = lessCompare): boolean {
        for (let i = 0; i < array.length - 1; i++) {
            if (compare(array[i], array[i + 1]) > 0) {
                return false;
            }
        }
        return true;
    };

    /**
     * 生成范围内的随机数 [min, max]
     * @param min 
     * @param max 
     * @returns 
     */
    export function randRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    /**
     * 数字转换为携带单位的字符串
     * @param num 
     * @param fixedPoint 
     * @returns 
     */
    export function number2UnitStr(num: number, fixedPoint: number = 1): string {
        if (num < szdefine.THOUSAND_MULTIPLE) {
            return num.toString();
        } else if (num < szdefine.MILLION_MULTIPLE) {
            return (Math.floor(num / Math.pow(10, 3 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "K";
        } else if (num < szdefine.BILLION_MULTIPLE) {
            return (Math.floor(num / Math.pow(10, 6 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "M";
        } else if (num < szdefine.TRILLION_MULTIPLE) {
            return (Math.floor(num / Math.pow(10, 9 - fixedPoint)) / Math.pow(10, fixedPoint)).toFixed(fixedPoint) + "G";
        } else if (num < szdefine.QUADRILLION_MULTIPLE) {
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
     * 洗牌打乱
     * @param array 
     */
    export function shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
} // namespace szutils
