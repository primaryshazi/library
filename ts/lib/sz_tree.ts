import { SZDEF } from "./sz_define";

export class SZTreeNode<T> {
    private value_: SZDEF.ElemType<T> = null;
    private left_: SZTreeNode<T> = null;
    private right_: SZTreeNode<T> = null;

    /**
     * 构建节点
     * @param value 节点值
     */
    public constructor(value: T) {
        this.value_ = value;
    }

    /**
     * 获取节点值
     */
    public get value(): SZDEF.ElemType<T> {
        return this.value_;
    }

    /**
     * 设置节点值
     */
    public set value(v: SZDEF.ElemType<T>) {
        this.value_ = v;
    }

    /**
     * 获取左子节点
     */
    public get left(): SZTreeNode<T> {
        return this.left_;
    }

    /**
     * 设置左子节点
     */
    public set left(node: SZTreeNode<T>) {
        this.left_ = node;
    }

    /**
     * 获取右子节点
     */
    public get right(): SZTreeNode<T> {
        return this.right_;
    }

    /**
     * 设置右子节点
     */
    public set right(node: SZTreeNode<T>) {
        this.right_ = node;
    }
}
