import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export class SZAVLTreeNode<T> {
    private value_: SZDEF.ElemType<T> = null;
    private left_: SZAVLTreeNode<T> = null;
    private right_: SZAVLTreeNode<T> = null;
    private height_: number = 1;

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
    public get left(): SZAVLTreeNode<T> {
        return this.left_;
    }

    /**
     * 设置左子节点
     */
    public set left(node: SZAVLTreeNode<T>) {
        this.left_ = node;
    }

    /**
     * 获取右子节点
     */
    public get right(): SZAVLTreeNode<T> {
        return this.right_;
    }

    /**
     * 设置右子节点
     */
    public set right(node: SZAVLTreeNode<T>) {
        this.right_ = node;
    }

    /**
     * 获取节点高度
     */
    public get height(): number {
        return this.height_;
    }

    /**
     * 设置节点高度
     */
    public set height(h: number) {
        this.height_ = h;
    }
}

export class SZAVLTree<T> {
    // 根节点
    private root_: SZAVLTreeNode<T> = null;
    // 节点数量
    private size_: number = 0;
    // 比较函数
    private compare_: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less;

    /**
     * 构建平衡二叉树
     * @param compare 比较函数
     */
    public constructor(compare: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less) {
        this.compare_ = compare;
    }

    /**
     * 获取根节点
     */
    public get root(): SZAVLTreeNode<T> {
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

        let result = this.insertNode(this.root_, value);
        this.root_ = result.node;
        if (result.inserted) {
            this.size_++;
        }
    }

    /**
     * 查找节点
     * @param value
     */
    public find(value: T): SZAVLTreeNode<T> {
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
     * 获取节点高度
     * @param node
     */
    private getHeight(node: SZAVLTreeNode<T>): number {
        return node ? node.height : 0;
    }

    /**
     * 更新节点高度
     * @param node
     */
    private updateHeight(node: SZAVLTreeNode<T>) {
        if (!node) {
            return;
        }
        node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    }

    /**
     * 获取平衡因子
     * @param node
     */
    private getBalance(node: SZAVLTreeNode<T>): number {
        if (!node) {
            return 0;
        }
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    /**
     * 右旋
     * @param y
     */
    private rotateRight(y: SZAVLTreeNode<T>): SZAVLTreeNode<T> {
        let x = y.left;
        let t2 = x.right;

        x.right = y;
        y.left = t2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    /**
     * 左旋
     * @param x
     */
    private rotateLeft(x: SZAVLTreeNode<T>): SZAVLTreeNode<T> {
        let y = x.right;
        let t2 = y.left;

        y.left = x;
        x.right = t2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    /**
     * 插入节点(内部)
     * @param node
     * @param value
     */
    private insertNode(node: SZAVLTreeNode<T>, value: T): { node: SZAVLTreeNode<T>, inserted: boolean } {
        if (!node) {
            return { node: new SZAVLTreeNode<T>(value), inserted: true };
        }

        let cond = this.compare_(value as SZDEF.ElemType<T>, node.value);
        if (cond < 0) {
            let result = this.insertNode(node.left, value);
            node.left = result.node;
            this.updateHeight(node);
            return { node: this.balanceAfterInsert(node, value), inserted: result.inserted };
        } else if (cond > 0) {
            let result = this.insertNode(node.right, value);
            node.right = result.node;
            this.updateHeight(node);
            return { node: this.balanceAfterInsert(node, value), inserted: result.inserted };
        } else {
            // 已存在则直接替换
            node.value = value;
            return { node, inserted: false };
        }
    }

    /**
     * 插入后平衡
     * @param node
     * @param value
     */
    private balanceAfterInsert(node: SZAVLTreeNode<T>, value: T): SZAVLTreeNode<T> {
        let balance = this.getBalance(node);

        if (balance > 1) {
            if (this.compare_(value as SZDEF.ElemType<T>, node.left.value) < 0) {
                return this.rotateRight(node);
            } else {
                node.left = this.rotateLeft(node.left);
                return this.rotateRight(node);
            }
        }

        if (balance < -1) {
            if (this.compare_(value as SZDEF.ElemType<T>, node.right.value) > 0) {
                return this.rotateLeft(node);
            } else {
                node.right = this.rotateRight(node.right);
                return this.rotateLeft(node);
            }
        }

        return node;
    }

    /**
     * 获取最小节点
     * @param node
     */
    private getMinNode(node: SZAVLTreeNode<T>): SZAVLTreeNode<T> {
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
    private removeNode(node: SZAVLTreeNode<T>, value: T): { node: SZAVLTreeNode<T>, removed: boolean } {
        if (!node) {
            return { node: null, removed: false };
        }

        let removed = false;
        let cond = this.compare_(value as SZDEF.ElemType<T>, node.value);
        if (cond < 0) {
            let result = this.removeNode(node.left, value);
            node.left = result.node;
            removed = result.removed;
        } else if (cond > 0) {
            let result = this.removeNode(node.right, value);
            node.right = result.node;
            removed = result.removed;
        } else {
            removed = true;
            if (!node.left || !node.right) {
                node = node.left ? node.left : node.right;
            } else {
                let minNode = this.getMinNode(node.right);
                node.value = minNode.value;
                let result = this.removeNode(node.right, minNode.value as T);
                node.right = result.node;
            }
        }

        if (!node) {
            return { node: null, removed };
        }

        this.updateHeight(node);

        let balance = this.getBalance(node);
        if (balance > 1) {
            if (this.getBalance(node.left) >= 0) {
                return { node: this.rotateRight(node), removed };
            } else {
                node.left = this.rotateLeft(node.left);
                return { node: this.rotateRight(node), removed };
            }
        }

        if (balance < -1) {
            if (this.getBalance(node.right) <= 0) {
                return { node: this.rotateLeft(node), removed };
            } else {
                node.right = this.rotateRight(node.right);
                return { node: this.rotateLeft(node), removed };
            }
        }

        return { node, removed };
    }
}
