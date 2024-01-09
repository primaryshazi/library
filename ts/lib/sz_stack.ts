import { SZArray } from "./sz_arrary";
import { szcommon } from "./sz_common";
import { szdef } from "./sz_define";

export class SZStack<T> extends SZArray<T> {
    public constructor() {
        super();
    }

    /**
     * 获取栈顶元素
     * @returns 
     */
    public top(): szdef.CAPACITY_VALUE_TYPE<T> {
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

        this.size_--;
        this.data_[this.size_] = undefined;
    }
}
