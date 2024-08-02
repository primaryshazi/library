import { SZDEF } from "./sz_define";

export abstract class SZArray<T> {
    // 存储数据
    protected data_: Array<SZDEF.ElemType<T>> = [];

    // 元素个数
    protected size_: number = 0;

    /**
     * 构建数组
     * @param cap 容量
     */
    constructor(cap: number = SZDEF.DEFAULT_CAPACITY) {
        cap = Math.floor(cap);
        cap = Math.max(cap, 1);
        this.data_ = new Array<SZDEF.ElemType<T>>(cap).fill(null);
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
            this.data_[i] = null;
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
            this.data_.push(...new Array<SZDEF.ElemType<T>>(c - this.data_.length).fill(null));
        }

        if (this.size_ > this.data_.length) {
            this.size_ = this.data_.length;
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
    protected expandCapacity() {
        this.data_.push(...new Array<SZDEF.ElemType<T>>(Math.ceil(this.data_.length * (SZDEF.DEFAULT_GROWTH_FACTOR - 1))).fill(null));
    }
}
