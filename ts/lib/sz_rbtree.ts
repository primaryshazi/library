import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

export enum SZRBColor {
    Red = 0,
    Black = 1,
}

export class SZRBTreeNode<T> {
    private value_: SZDEF.ElemType<T> = null;
    private left_: SZRBTreeNode<T> = null;
    private right_: SZRBTreeNode<T> = null;
    private parent_: SZRBTreeNode<T> = null;
    private color_: SZRBColor = SZRBColor.Red;

    /**
     * 构建节点
     * @param value 节点值
     * @param color 节点颜色
     */
    public constructor(value: T, color: SZRBColor = SZRBColor.Red) {
        this.value_ = value;
        this.color_ = color;
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
    public get left(): SZRBTreeNode<T> {
        return this.left_;
    }

    /**
     * 设置左子节点
     */
    public set left(node: SZRBTreeNode<T>) {
        this.left_ = node;
    }

    /**
     * 获取右子节点
     */
    public get right(): SZRBTreeNode<T> {
        return this.right_;
    }

    /**
     * 设置右子节点
     */
    public set right(node: SZRBTreeNode<T>) {
        this.right_ = node;
    }

    /**
     * 获取父节点
     */
    public get parent(): SZRBTreeNode<T> {
        return this.parent_;
    }

    /**
     * 设置父节点
     */
    public set parent(node: SZRBTreeNode<T>) {
        this.parent_ = node;
    }

    /**
     * 获取颜色
     */
    public get color(): SZRBColor {
        return this.color_;
    }

    /**
     * 设置颜色
     */
    public set color(c: SZRBColor) {
        this.color_ = c;
    }
}

export class SZRBTree<T> {
    // 根节点
    private root_: SZRBTreeNode<T> = null;
    // 节点数量
    private size_: number = 0;
    // 比较函数
    private compare_: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less;

    /**
     * 构建红黑树
     * @param compare 比较函数
     */
    public constructor(compare: SZCOMMON.Compare<SZDEF.ElemType<T>> = SZCOMMON.less) {
        this.compare_ = compare;
    }

    /**
     * 获取根节点
     */
    public get root(): SZRBTreeNode<T> {
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
            this.root_ = new SZRBTreeNode<T>(value, SZRBColor.Black);
            this.size_ = 1;
            return;
        }

        let cur = this.root_;
        let parent: SZRBTreeNode<T> = null;
        while (cur) {
            parent = cur;
            let cond = this.compare_(value as SZDEF.ElemType<T>, cur.value);
            if (cond < 0) {
                cur = cur.left;
            } else if (cond > 0) {
                cur = cur.right;
            } else {
                cur.value = value;
                return;
            }
        }

        let node = new SZRBTreeNode<T>(value, SZRBColor.Red);
        node.parent = parent;
        if (this.compare_(value as SZDEF.ElemType<T>, parent.value) < 0) {
            parent.left = node;
        } else {
            parent.right = node;
        }

        this.fixInsert(node);
        this.size_++;
    }

    /**
     * 查找节点
     * @param value
     */
    public find(value: T): SZRBTreeNode<T> {
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
        let node = this.find(value);
        if (!node) {
            return false;
        }

        this.deleteNode(node);
        this.size_--;
        return true;
    }

    /**
     * 左旋
     * @param x
     */
    private rotateLeft(x: SZRBTreeNode<T>) {
        let y = x.right;
        if (!y) {
            return;
        }

        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        }

        y.parent = x.parent;
        if (!x.parent) {
            this.root_ = y;
        } else if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        y.left = x;
        x.parent = y;
    }

    /**
     * 右旋
     * @param y
     */
    private rotateRight(y: SZRBTreeNode<T>) {
        let x = y.left;
        if (!x) {
            return;
        }

        y.left = x.right;
        if (x.right) {
            x.right.parent = y;
        }

        x.parent = y.parent;
        if (!y.parent) {
            this.root_ = x;
        } else if (y == y.parent.left) {
            y.parent.left = x;
        } else {
            y.parent.right = x;
        }

        x.right = y;
        y.parent = x;
    }

    /**
     * 插入后修复
     * @param node
     */
    private fixInsert(node: SZRBTreeNode<T>) {
        let cur = node;
        while (cur.parent && cur.parent.color == SZRBColor.Red) {
            let parent = cur.parent;
            let grand = parent.parent;
            if (!grand) {
                break;
            }

            if (parent == grand.left) {
                let uncle = grand.right;
                if (uncle && uncle.color == SZRBColor.Red) {
                    parent.color = SZRBColor.Black;
                    uncle.color = SZRBColor.Black;
                    grand.color = SZRBColor.Red;
                    cur = grand;
                } else {
                    if (cur == parent.right) {
                        cur = parent;
                        this.rotateLeft(cur);
                        parent = cur.parent;
                        grand = parent ? parent.parent : null;
                    }

                    if (parent) {
                        parent.color = SZRBColor.Black;
                    }
                    if (grand) {
                        grand.color = SZRBColor.Red;
                        this.rotateRight(grand);
                    }
                }
            } else {
                let uncle = grand.left;
                if (uncle && uncle.color == SZRBColor.Red) {
                    parent.color = SZRBColor.Black;
                    uncle.color = SZRBColor.Black;
                    grand.color = SZRBColor.Red;
                    cur = grand;
                } else {
                    if (cur == parent.left) {
                        cur = parent;
                        this.rotateRight(cur);
                        parent = cur.parent;
                        grand = parent ? parent.parent : null;
                    }

                    if (parent) {
                        parent.color = SZRBColor.Black;
                    }
                    if (grand) {
                        grand.color = SZRBColor.Red;
                        this.rotateLeft(grand);
                    }
                }
            }
        }

        if (this.root_) {
            this.root_.color = SZRBColor.Black;
        }
    }

    /**
     * 删除节点
     * @param node
     */
    private deleteNode(node: SZRBTreeNode<T>) {
        let y = node;
        let yOriginalColor = y.color;
        let x: SZRBTreeNode<T> = null;
        let xParent: SZRBTreeNode<T> = null;

        if (!node.left) {
            x = node.right;
            xParent = node.parent;
            this.transplant(node, node.right);
        } else if (!node.right) {
            x = node.left;
            xParent = node.parent;
            this.transplant(node, node.left);
        } else {
            y = this.minimum(node.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent == node) {
                xParent = y;
            } else {
                xParent = y.parent;
                this.transplant(y, y.right);
                y.right = node.right;
                if (y.right) {
                    y.right.parent = y;
                }
            }

            this.transplant(node, y);
            y.left = node.left;
            if (y.left) {
                y.left.parent = y;
            }
            y.color = node.color;
        }

        if (yOriginalColor == SZRBColor.Black) {
            this.fixDelete(x, xParent);
        }
    }

    /**
     * 替换节点
     * @param u
     * @param v
     */
    private transplant(u: SZRBTreeNode<T>, v: SZRBTreeNode<T>) {
        if (!u.parent) {
            this.root_ = v;
        } else if (u == u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }

        if (v) {
            v.parent = u.parent;
        }
    }

    /**
     * 最小节点
     * @param node
     */
    private minimum(node: SZRBTreeNode<T>): SZRBTreeNode<T> {
        let cur = node;
        while (cur && cur.left) {
            cur = cur.left;
        }
        return cur;
    }

    /**
     * 删除后修复
     * @param node
     * @param parent
     */
    private fixDelete(node: SZRBTreeNode<T>, parent: SZRBTreeNode<T>) {
        let x = node;
        let p = parent;
        while (x != this.root_ && this.getColor(x) == SZRBColor.Black) {
            if (x == (p ? p.left : null)) {
                let w = p ? p.right : null;
                if (this.getColor(w) == SZRBColor.Red) {
                    w.color = SZRBColor.Black;
                    p.color = SZRBColor.Red;
                    this.rotateLeft(p);
                    w = p ? p.right : null;
                }

                if (this.getColor(w ? w.left : null) == SZRBColor.Black &&
                    this.getColor(w ? w.right : null) == SZRBColor.Black) {
                    if (w) {
                        w.color = SZRBColor.Red;
                    }
                    x = p;
                    p = x ? x.parent : null;
                } else {
                    if (this.getColor(w ? w.right : null) == SZRBColor.Black) {
                        if (w && w.left) {
                            w.left.color = SZRBColor.Black;
                        }
                        if (w) {
                            w.color = SZRBColor.Red;
                            this.rotateRight(w);
                        }
                        w = p ? p.right : null;
                    }

                    if (w) {
                        w.color = p ? p.color : SZRBColor.Black;
                    }
                    if (p) {
                        p.color = SZRBColor.Black;
                    }
                    if (w && w.right) {
                        w.right.color = SZRBColor.Black;
                    }
                    if (p) {
                        this.rotateLeft(p);
                    }
                    x = this.root_;
                }
            } else {
                let w = p ? p.left : null;
                if (this.getColor(w) == SZRBColor.Red) {
                    w.color = SZRBColor.Black;
                    p.color = SZRBColor.Red;
                    this.rotateRight(p);
                    w = p ? p.left : null;
                }

                if (this.getColor(w ? w.left : null) == SZRBColor.Black &&
                    this.getColor(w ? w.right : null) == SZRBColor.Black) {
                    if (w) {
                        w.color = SZRBColor.Red;
                    }
                    x = p;
                    p = x ? x.parent : null;
                } else {
                    if (this.getColor(w ? w.left : null) == SZRBColor.Black) {
                        if (w && w.right) {
                            w.right.color = SZRBColor.Black;
                        }
                        if (w) {
                            w.color = SZRBColor.Red;
                            this.rotateLeft(w);
                        }
                        w = p ? p.left : null;
                    }

                    if (w) {
                        w.color = p ? p.color : SZRBColor.Black;
                    }
                    if (p) {
                        p.color = SZRBColor.Black;
                    }
                    if (w && w.left) {
                        w.left.color = SZRBColor.Black;
                    }
                    if (p) {
                        this.rotateRight(p);
                    }
                    x = this.root_;
                }
            }
        }

        if (x) {
            x.color = SZRBColor.Black;
        }
    }

    /**
     * 获取颜色，空节点视为黑色
     * @param node
     */
    private getColor(node: SZRBTreeNode<T>): SZRBColor {
        return node ? node.color : SZRBColor.Black;
    }
}
