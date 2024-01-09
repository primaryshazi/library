import { szcommon } from "./sz_common";
import { szdef } from "./sz_define";

export class SZKeyNode<T> {
    public key: T;
    public next: szdef.NODE_TYPE<SZKeyNode<T>>;
    public constructor(k: T) {
        this.key = k;
        this.next = null;
    }

    static equal<T>(a: szdef.NODE_TYPE<SZKeyNode<T>>, b: szdef.NODE_TYPE<SZKeyNode<T>>): boolean {
        if (a != null && b != null) {
            return a.key == b.key;
        }

        return a == b;
    }

    static greater<T>(a: szdef.NODE_TYPE<SZKeyNode<T>>, b: szdef.NODE_TYPE<SZKeyNode<T>>): number {
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

    static less<T>(a: szdef.NODE_TYPE<SZKeyNode<T>>, b: szdef.NODE_TYPE<SZKeyNode<T>>): number {
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
    public left: SZKVNode<X, Y> | null;
    public right: SZKVNode<X, Y> | null;
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
