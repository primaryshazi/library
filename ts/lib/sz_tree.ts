import { SZCOMMON } from "./sz_common";
import { SZDEF } from "./sz_define";

//  容器节点类型
export type SZNodeType<T> = T | null;

export class SZKeyNode<T> {
    public key: T;
    public next: SZNodeType<SZKeyNode<T>>;
    public constructor(k: T) {
        this.key = k;
        this.next = null;
    }

    static equal<T>(a: SZNodeType<SZKeyNode<T>>, b: SZNodeType<SZKeyNode<T>>): boolean {
        if (a != null && b != null) {
            return a.key == b.key;
        }

        return a == b;
    }

    static greater<T>(a: SZNodeType<SZKeyNode<T>>, b: SZNodeType<SZKeyNode<T>>): number {
        if (a != null && b != null) {
            if (a.key == b.key) {
                return 0;
            }

            return a.key > b.key ? -1 : 1;
        }

        if (a != null) {
            return -1;
        }

        if (b != null) {
            return 1;
        }

        return 0;
    }

    static less<T>(a: SZNodeType<SZKeyNode<T>>, b: SZNodeType<SZKeyNode<T>>): number {
        if (a != null && b != null) {
            if (a.key == b.key) {
                return 0;
            }

            return a.key < b.key ? -1 : 1;
        }

        if (a != null) {
            return 1;
        }

        if (b != null) {
            return -1;
        }

        return 0;
    }
}

export class SZKVNode<X, Y> {
    public key: X;
    public value: Y;
    public left: SZNodeType<SZKVNode<X, Y>>;
    public right: SZNodeType<SZKVNode<X, Y>>;
    public constructor(k: X, v: Y) {
        this.key = k;
        this.value = v;
        this.left = null;
        this.right = null;
    }

    static equal<X, Y>(a: SZKVNode<X, Y>, b: SZKVNode<X, Y>): boolean {
        if (a != null && b != null) {
            return a.key == b.key;
        }

        return a == b;
    }

    static greater<X, Y>(a: SZKVNode<X, Y>, b: SZKVNode<X, Y>): number {
        if (a != null && b != null) {
            if (a.key == b.key) {
                return 0;
            }

            return a.key > b.key ? -1 : 1;
        }

        if (a != null) {
            return -1;
        }

        if (b != null) {
            return 1;
        }

        return 0;
    }

    static less<X, Y>(a: SZKVNode<X, Y>, b: SZKVNode<X, Y>): number {
        if (a != null && b != null) {
            if (a.key == b.key) {
                return 0;
            }

            return a.key < b.key ? -1 : 1;
        }

        if (a != null) {
            return 1;
        }

        if (b != null) {
            return -1;
        }

        return 0;
    }
}

export abstract class SZTree<X, Y> {
    // 根节点
    protected root_: SZNodeType<SZKVNode<X, Y>> = null;

    // 元素数量
    protected size_: number = 0;
}
