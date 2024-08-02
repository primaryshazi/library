import { SZArray } from "./sz_arrary";
import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export class SZHeap<T> extends SZArray<T> {
    // 比较函数，用于构建最大堆或者最小堆
    private compare_: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.greater;

    /**
     * 构建堆
     * @param cap 容量
     * @param compare 比较函数 用于构建最大堆或者最小堆
     */
    public constructor(cap: number = SZDEF.DEFAULT_CAPACITY, compare: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.greater) {
        super(cap);
        this.compare_ = compare;
    }

    /**
     * 获取比较函数
     */
    public get compare(): SZCOMMON.Compare<SZDEF.ElemType<T>> {
        return this.compare_;
    }

    /**
     * 获取堆顶元素
     * @returns
     */
    public top(): SZDEF.ElemType<T> {
        if (this.size_ > 0 && this.data_.length > 0) {
            return this.data_[0];
        }

        return null;
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

        this.data_[this.size_] = null;
    }

    /**
     * 构建一个堆
     * @param array
     * @param compare
     */
    static buildHeap<T>(array: Array<SZDEF.ElemType<T>>, compare: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.greater) {
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
