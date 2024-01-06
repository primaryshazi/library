import { szcommon } from "./sz_common";
import { szdefine } from "./sz_define";

export class SZHeap<T> {
    // 比较函数，用于构建最大堆或者最小堆
    private compare_: szcommon.conditonCompare<T | undefined> = szcommon.greaterCompare;

    // 储存元素
    private data_: Array<T | undefined> = [];

    // 元素个数
    private size_: number = 0;

    /**
     * 构建堆
     * @param compareFunc 默认最大堆
     */
    public constructor(compareFunc: szcommon.conditonCompare<T | undefined> = szcommon.greaterCompare) {
        this.compare_ = compareFunc;
        this.data_ = new Array<T | undefined>(szdefine.DEFAULT_CAPACITY).fill(undefined);
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
            this.data_.push(...new Array<T | undefined>(c - this.data_.length).fill(undefined));
        }

        if (this.size_ > this.data_.length) {
            this.size_ = this.data_.length;
        }
    }

    /**
     * 获取栈顶元素
     * @returns 
     */
    public top(): T | undefined {
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
            this.resize();
        }

        let cur = this.size_;
        let next = Math.floor(cur / 2);
        while (cur > 0 && this.compare_(this.data_[next], value) == 1) {
            this.data_[cur] = this.data_[next];
            cur = next;
            next = Math.floor(cur / 2);
        }
        this.data_[cur] = value;
        this.size_++;
    }

    /**
     * 弹出元素
     */
    public pop() {
        if (this.size_ <= 0) {
            return;
        }

        let final = this.size_ - 1;
        let last = this.data_[final];
        let cur = 0;
        let child = 0;

        this.data_[final] = undefined;
        for (cur = 0; cur * 2 < final; cur = child) {
            child = cur * 2 + 1;
            if (child + 1 < final && this.compare_(this.data_[child], this.data_[child + 1]) == 1) {
                child++;
            }

            if (this.compare_(last, this.data_[child]) == -1) {
                break;
            } else {
                this.data_[cur] = this.data_[child];
            }
        }
        this.data_[cur] = last;
        this.size_ = final;
    }

    /**
     * 重新扩容
     */
    private resize() {
        this.data_.push(...new Array<T | undefined>(Math.ceil(this.data_.length * (szdefine.DEFAULT_GROWTH_FACTOR - 1))).fill(undefined));
    }
}
