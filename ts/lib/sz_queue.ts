import { szcommon } from "./sz_common";
import { szdef } from "./sz_define";

export class SZQueue<T> {
    // 储存元素
    private data_: Array<szdef.CAPACITY_VALUE_TYPE<T>> = [];

    // 元素个数
    private size_: number = 0;

    public constructor() {
        this.data_ = new Array<szdef.CAPACITY_VALUE_TYPE<T>>(szdef.DEFAULT_CAPACITY).fill(undefined);
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
            this.data_.push(...new Array<szdef.CAPACITY_VALUE_TYPE<T>>(c - this.data_.length).fill(undefined));
        }

        if (this.size_ > this.data_.length) {
            this.size_ = this.data_.length;
        }
    }

    /**
     * 获取队首元素
     * @returns 
     */
    public front(): szdef.CAPACITY_VALUE_TYPE<T> {
        if (this.size_ > 0 && this.data_.length > 0) {
            return this.data_[0];
        }

        return undefined;
    }

    /**
     * 获得队尾元素
     * @returns 
     */
    public back(): szdef.CAPACITY_VALUE_TYPE<T> {
        if (this.size_ > 0 && this.data_.length > 0) {
            return this.data_[this.size_ - 1];
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
    }

    /**
     * 弹出元素
     */
    public pop() {
        if (this.size_ <= 0) {
            return;
        }

        this.size--;
        if (this.data_.length == 1) {
            this.data_[0] = undefined;
        } else {
            this.data_.splice(0, 1);
        }
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
        this.data_.push(...new Array<szdef.CAPACITY_VALUE_TYPE<T>>(Math.ceil(this.data_.length * (szdef.DEFAULT_GROWTH_FACTOR - 1))).fill(undefined));
    }
}
