import { SZArray } from "./sz_arrary";
import { szcommon } from "./sz_common";
import { szdef } from "./sz_define";

export class SZQueue<T> extends SZArray<T> {
    /**
     * 构建队列
     * @param cap 容量
     */
    public constructor(cap: number = szdef.DEFAULT_CAPACITY) {
        super(cap);
    }

    /**
     * 获取队首元素
     * @returns 
     */
    public front(): szdef.VALUE_TYPE<T> {
        if (this.size_ > 0 && this.data_.length > 0) {
            return this.data_[0];
        }

        return undefined;
    }

    /**
     * 获得队尾元素
     * @returns 
     */
    public back(): szdef.VALUE_TYPE<T> {
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

        if (this.size_ >= this.data_.length) {
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

        this.size_--;
        if (this.data_.length == 1) {
            this.data_[0] = undefined;
        } else {
            this.data_.shift();
        }
    }
}
