import { SZArray, SZElementType } from "./sz_arrary";
import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export class SZStack<T> extends SZArray<T> {
    /**
     * 构建栈
     * @param cap 容量
     */
    public constructor(cap: number = SZDEF.DEFAULT_CAPACITY) {
        super(cap);
    }

    /**
     * 获取栈顶元素
     * @returns
     */
    public top(): SZElementType<T> {
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
