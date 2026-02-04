import { SZTreeNode } from "./sz_tree";
import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export class SZBinaryTree<T> {
    // 根节点
    private root_: SZTreeNode<T> = null;
    // 节点数量
    private size_: number = 0;
    // 比较函数
    private compare_: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less;

    /**
     * 构建二叉搜索树
     * @param compare 比较函数
     */
    public constructor(compare: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less) {
        this.compare_ = compare;
    }

    /**
     * 获取根节点
     */
    public get root(): SZTreeNode<T> {
        return this.root_;
    }

    /**
     * 获取节点数量
     */
    public get size(): number {
        return this.size_;
    }

    /**
     * 清空树
     */
    public clear() {
        this.root_ = null;
        this.size_ = 0;
    }

    /**
     * 插入节点
     * @param value
     */
    public insert(value: T) {
        if (value === null || value === undefined) {
            throw new Error("insert value error");
        }

        if (!this.root_) {
            this.root_ = new SZTreeNode<T>(value);
            this.size_ = 1;
            return;
        }

        let cur = this.root_;
        while (true) {
            let cond = this.compare_(value as SZDEF.ElemType<T>, cur.value);
            if (cond < 0) {
                if (cur.left) {
                    cur = cur.left;
                } else {
                    cur.left = new SZTreeNode<T>(value);
                    this.size_++;
                    return;
                }
            } else if (cond > 0) {
                if (cur.right) {
                    cur = cur.right;
                } else {
                    cur.right = new SZTreeNode<T>(value);
                    this.size_++;
                    return;
                }
            } else {
                // 已存在则直接替换
                cur.value = value;
                return;
            }
        }
    }

    /**
     * 查找节点
     * @param value
     */
    public find(value: T): SZTreeNode<T> {
        if (!this.root_) {
            return null;
        }

        let cur = this.root_;
        while (cur) {
            let cond = this.compare_(value as SZDEF.ElemType<T>, cur.value);
            if (cond < 0) {
                cur = cur.left;
            } else if (cond > 0) {
                cur = cur.right;
            } else {
                return cur;
            }
        }

        return null;
    }

    /**
     * 是否包含节点
     * @param value
     */
    public contains(value: T): boolean {
        return this.find(value) != null;
    }

    /**
     * 更新节点值
     * @param oldValue
     * @param newValue
     */
    public update(oldValue: T, newValue: T): boolean {
        if (this.remove(oldValue)) {
            this.insert(newValue);
            return true;
        }
        return false;
    }

    /**
     * 删除节点
     * @param value
     */
    public remove(value: T): boolean {
        let result = this.removeNode(this.root_, value);
        this.root_ = result.node;
        if (result.removed) {
            this.size_--;
        }
        return result.removed;
    }

    /**
     * 获取最小节点
     * @param node
     */
    private getMinNode(node: SZTreeNode<T>): SZTreeNode<T> {
        let cur = node;
        while (cur && cur.left) {
            cur = cur.left;
        }
        return cur;
    }

    /**
     * 删除节点(内部)
     * @param node
     * @param value
     */
    private removeNode(node: SZTreeNode<T>, value: T): { node: SZTreeNode<T>, removed: boolean } {
        if (!node) {
            return { node: null, removed: false };
        }

        let cond = this.compare_(value as SZDEF.ElemType<T>, node.value);
        if (cond < 0) {
            let result = this.removeNode(node.left, value);
            node.left = result.node;
            return { node, removed: result.removed };
        } else if (cond > 0) {
            let result = this.removeNode(node.right, value);
            node.right = result.node;
            return { node, removed: result.removed };
        }

        if (!node.left && !node.right) {
            return { node: null, removed: true };
        }

        if (!node.left) {
            return { node: node.right, removed: true };
        }

        if (!node.right) {
            return { node: node.left, removed: true };
        }

        let minNode = this.getMinNode(node.right);
        node.value = minNode.value;
        let result = this.removeNode(node.right, minNode.value as T);
        node.right = result.node;
        return { node, removed: true };
    }
}
