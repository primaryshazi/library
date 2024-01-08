import { szcommon } from "./sz_common";
import { szdefine } from "./sz_define";

export type szheap_value_type<T> = T | undefined;

export class SZHeap<T> {
    // 比较函数，用于构建最大堆或者最小堆
    private compare_: szcommon.conditonCompare<szheap_value_type<T>> = szcommon.greaterCompare;

    // 储存元素
    private data_: Array<szheap_value_type<T>> = [];

    // 元素个数
    private size_: number = 0;

    /**
     * 构建堆
     * @param compareFunc 默认最大堆
     */
    public constructor(compareFunc: szcommon.conditonCompare<szheap_value_type<T>> = szcommon.greaterCompare) {
        this.compare_ = compareFunc;
        this.data_ = new Array<szheap_value_type<T>>(szdefine.DEFAULT_CAPACITY).fill(undefined);
        this.size_ = 0;
    }

    /**
     * 获取元素个数
     */
    public get size(): number {
        return this.size_;
    }

    /**
     * 设置元素个数
     */
    public set size(s: number) {
        s = Math.floor(s);
        if (s < 0 || s > this.data_.length) {
            throw new Error("set size error");
        }

        if (s == this.size_) {
            return;
        }

        for (let i = s; i < this.data_.length; i++) {
            this.data_[i] = undefined;
        }
        this.size_ = s;
    }

    /**
     * 获取容量
     */
    public get capacity(): number {
        return this.data_.length;
    }

    /**
     * 设置容量
     */
    public set capacity(c: number) {
        c = Math.floor(c);
        if (c <= 0) {
            throw new Error("set capacity error");
        }

        if (c == this.data_.length) {
            return;
        }

        if (c < this.data_.length) {
            this.data_.length = c;
        } else {
            this.data_.push(...new Array<szheap_value_type<T>>(c - this.data_.length).fill(undefined));
        }

        if (this.size_ > this.data_.length) {
            this.size_ = this.data_.length;
        }
    }

    /**
     * 获取比较函数
     */
    public get compare(): szcommon.conditonCompare<szheap_value_type<T>> {
        return this.compare_;
    }

    /**
     * 获取栈顶元素
     * @returns 
     */
    public top(): szheap_value_type<T> {
        if (this.size_ > 0 && this.data_.length > 0) {
            return this.data_[0];
        }

        return undefined;
    }

    /**
     * 推入元素
     * @param value 
     */
    public push(value: T) {
        if (!szcommon.isValidValue(value)) {
            throw new Error("push error");
        }

        if (this.size >= this.data_.length) {
            this.expandCapacity();
        }

        this.data_[this.size_] = value;
        this.size_++;

        let cur = this.size_ - 1;
        let next = Math.floor((cur - 1) / 2);
        while (cur > 0 && this.compare_(this.data_[cur], this.data_[next]) == -1) {
            [this.data_[cur], this.data_[next]] = [this.data_[next], this.data_[cur]];

            cur = next;
            next = Math.floor((cur - 1) / 2);
        }
    }

    /**
     * 弹出元素
     */
    public pop() {
        if (this.size_ <= 0) {
            return;
        }

        this.data_[0] = this.data_[this.size_ - 1];
        this.size_--;

        let cur = 0;
        while (cur < this.size_) {
            let next = cur;
            let left = 2 * cur + 1;
            let right = 2 * cur + 2;

            if (left < this.size_ && this.compare_(this.data_[left], this.data_[next]) == -1) {
                next = left;
            }

            if (right < this.size_ && this.compare_(this.data_[right], this.data_[next]) == -1) {
                next = right;
            }

            if (next != cur) {
                [this.data_[cur], this.data_[next]] = [this.data_[next], this.data_[cur]];
                cur = next;
            } else {
                break;
            }
        }

        this.data_[this.size_] = undefined;
    }

    /**
     * 收缩
     */
    public shrink() {
        if (this.data_.length > this.size_) {
            this.data_.length = Math.max(this.size_, 1);
        }
    }

    /**
     * 重新扩容
     */
    private expandCapacity() {
        this.data_.push(...new Array<szheap_value_type<T>>(Math.ceil(this.data_.length * (szdefine.DEFAULT_GROWTH_FACTOR - 1))).fill(undefined));
    }

    /**
     * 构建一个堆
     * @param array 
     * @param compare 
     */
    static buildHeap<T>(array: Array<szheap_value_type<T>>, compare: szcommon.conditonCompare<szheap_value_type<T>> = szcommon.greaterCompare) {
        for (let index = array.length - 1; index >= 0; index--) {
            let cur = index;
            while (cur < array.length) {
                let next = cur;
                let left = 2 * cur + 1;
                let right = 2 * cur + 2;

                if (left < array.length && compare(array[left], array[next]) == -1) {
                    next = left;
                }

                if (right < array.length && compare(array[right], array[next]) == -1) {
                    next = right;
                }

                if (next != cur) {
                    [array[cur], array[next]] = [array[next], array[cur]];
                    cur = next;
                } else {
                    break;
                }
            }
        }
    }
}
