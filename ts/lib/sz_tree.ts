import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export class SZTreeNode<K, V> {
    public key: K;
    public value: V;
    public left: SZDEF.ElemType<SZTreeNode<K, V>> = null;
    public right: SZDEF.ElemType<SZTreeNode<K, V>> = null;
    public height: number = 1; // 新增节点的初始高度为1

    constructor(k: K, v: V) {
        this.key = k;
        this.value = v;
    }

    /**
     * 前序遍历
     * @returns
     */
    public preOrder(): string {
        let str = "[" + this.key + ":" + this.value + "]";
        if (this.left != null) {
            str += " " + this.left.preOrder();
        }
        if (this.right != null) {
            str += " " + this.right.preOrder();
        }
        return str;
    }

    /**
     * 中序遍历
     * @returns
     */
    public inOrder(): string {
        let str = "";
        if (this.left != null) {
            str += this.left.inOrder() + " ";
        }
        str += "[" + this.key + ":" + this.value + "]";
        if (this.right != null) {
            str += " " + this.right.inOrder();
        }
        return str;
    }

    /**
     * 后序遍历
     * @returns
     */
    public postOrder(): string {
        let str = "";
        if (this.left != null) {
            str += this.left.postOrder() + " ";
        }
        if (this.right != null) {
            str += this.right.postOrder() + " ";
        }
        str += "[" + this.key + ":" + this.value + "]";
        return str;
    }
}

export class SZBinaryTree<K, V> {
    private compare_: SZCOMMON.Compare<K> = SZCOMMON.less;
    public get compare(): Readonly<SZCOMMON.Compare<K>> {
        return this.compare_;
    }

    private root_: SZDEF.ElemType<SZTreeNode<K, V>> = null;
    public get root(): Readonly<SZDEF.ElemType<SZTreeNode<K, V>>> {
        return this.root_;
    }

    private size_: number = 0;
    public get size(): number {
        return this.size_;
    }

    /**
     * 构建二叉树
     * @param compare 排序函数
     */
    public constructor(compare: SZCOMMON.Compare<K> = SZCOMMON.less) {
        this.compare_ = compare;
    }

    /**
     * 添加元素
     * @param k
     * @param v
     * @returns true: 正常推入 false: 已经存在
     */
    public set(k: K, v: V): boolean {
        let beforeSize = this.size_;
        this.root_ = this.setCore(this.root_, k, v);
        return beforeSize < this.size_;
    }

    /**
     * 获取元素
     * @param k
     * @returns
     */
    public get(k: K): SZDEF.ElemType<SZTreeNode<K, V>> {
        if (this.root_ == null) {
            return null;
        }

        let cur: SZDEF.ElemType<SZTreeNode<K, V>> = this.root_;

        while (cur != null) {
            if (this.compare_(k, cur.key) == -1) {
                cur = cur.left;
            } else if (this.compare_(k, cur.key) == 1) {
                cur = cur.right;
            } else {
                return cur;
            }
        }

        return null;
    }

    /**
     * 是否存在元素
     * @param k
     * @returns
     */
    public has(k: K): boolean {
        if (this.get(k) == null) {
            return false;
        }
        return true;
    }

    /**
     * 删除元素
     * @param k
     * @returns
     */
    public del(k: K): boolean {
        let beforeSize = this.size_;
        this.root_ = this.delCore(this.root_, k);
        return beforeSize > this.size_;
    }

    /**
     * 寻找最小
     * @returns
     */
    public fineMin(): SZDEF.ElemType<SZTreeNode<K, V>> {
        return this.findMinCore(this.root_);
    }

    /**
     * 寻找最大
     * @returns
     */
    public fineMax(): SZDEF.ElemType<SZTreeNode<K, V>> {
        return this.findMaxCore(this.root_);
    }

    /**
     * 检查
     */
    public check(): boolean {
        let cur = this.root_;
        while (cur != null) {
            if (cur.left != null && this.compare_(cur.key, cur.left.key) <= 0) {
                return false;
            }
            if (cur.right != null && this.compare_(cur.key, cur.right.key) >= 0) {
                return false;
            }
            cur = cur.right;
        }

        return true;
    }

    private setCore(tree: SZDEF.ElemType<SZTreeNode<K, V>>, k: K, v: V): SZDEF.ElemType<SZTreeNode<K, V>> {
        // 当前节点为空则表示找到合适位置
        if (tree == null) {
            tree = new SZTreeNode(k, v);
            this.size_++;
        } else {
            /**
             * 若key小于当前节点key，则在其左子树插入，并返回左子树
             * 若key大于当前节点key，则在其右子树插入，并返回右子树
             * 若相等则不作为直接返回子树
             */
            if (this.compare_(k, tree.key) == -1) {
                tree.left = this.setCore(tree.left, k, v);
            } else if (this.compare_(k, tree.key) == 1) {
                tree.right = this.setCore(tree.right, k, v);
            } else {
                tree.value = v;
            }
        }

        return tree;
    }

    /**
     * 寻找指定节点下最小
     * @param tree
     * @returns
     */
    private findMinCore(tree: SZDEF.ElemType<SZTreeNode<K, V>>): SZDEF.ElemType<SZTreeNode<K, V>> {
        let cur = tree;
        if (cur != null) {
            while (cur.left != null) {
                cur = cur.left;
            }
        }

        return cur;
    }

    /**
     * 寻找指定节点下最大
     * @param tree
     * @returns
     */
    private findMaxCore(tree: SZDEF.ElemType<SZTreeNode<K, V>>): SZDEF.ElemType<SZTreeNode<K, V>> {
        let cur = tree;
        if (cur != null) {
            while (cur.right != null) {
                cur = cur.right;
            }
        }

        return cur;
    }

    /**
     * 删除核心逻辑
     * @param tree
     * @param k
     * @returns
     */
    private delCore(tree: SZDEF.ElemType<SZTreeNode<K, V>>, k: K): SZDEF.ElemType<SZTreeNode<K, V>> {
        if (tree != null) {
            /**
             * 若key小于当前节点key，则在左子树删除节点
             * 若key大于当前节点key，则在右子树删除节点
             * 若相等则删除节点
             */
            if (this.compare_(k, tree.key) == -1) {
                tree.left = this.delCore(tree.left, k);
            } else if (this.compare_(k, tree.key) == 1) {
                tree.right = this.delCore(tree.right, k);
            } else {
                /**
                 * 若其左右节点均不为空，则找到右子树最小值，将其赋予当前节点，并删除右子树中最小节点
                 * 若其左子树为空，则将当前节点置为右子树
                 * 若其右子树为空，则将当前节点置为左子树
                 */
                if (tree.left != null && tree.right != null) {
                    let minNode = this.findMinCore(tree.right);
                    if (minNode != null) {
                        tree.key = minNode.key;
                        tree.value = minNode.value;
                        tree.right = this.delCore(tree.right, tree.key);
                    }
                } else {
                    tree = tree.left != null ? tree.left : tree.right;
                    this.size_--;
                }
            }
        }

        return tree;
    }
}
