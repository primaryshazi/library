/**
 * 2维向量
 */
export class SZVec2 {
    public x: number = 0;
    public y: number = 0;

    constructor(x?: number, y?: number) {
        if (x) {
            this.x = x;
        }

        if (y) {
            this.y = y;
        }
    }

    // 零向量
    public static readonly ZERO = new SZVec2(0, 0);

    // x正半轴
    public static readonly UNIT_X = new SZVec2(1, 0);

    // x负半轴
    public static readonly UNIT_NEG_X = new SZVec2(-1, 0);

    // y正半轴
    public static readonly UNIT_Y = new SZVec2(0, 1);

    // y负半轴
    public static readonly UNIT_NEG_Y = new SZVec2(0, -1);

    // 单位向量
    public static readonly ONE = new SZVec2(1, 1);

    // 单位负向量
    public static readonly NEG_ONE = new SZVec2(-1, -1);

    /**
     * 克隆
     * @returns
     */
    public clone(): SZVec2 {
        return new SZVec2(this.x, this.y);
    }

    /**
     * 向量长度
     * @returns
     */
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 加
     * @param vec
     * @returns
     */
    public add(vec: SZVec2): SZVec2 {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    /**
     * 加
     * @param x
     * @param y
     * @returns
     */
    public add2f(x: number, y: number): SZVec2 {
        this.x += x;
        this.y += y;
        return this;
    }

    /**
     * 减
     * @param vec
     * @returns
     */
    public sub(vec: SZVec2): SZVec2 {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    /**
     * 减法
     * @param x
     * @param y
     * @returns
     */
    public sub2f(x: number, y: number): SZVec2 {
        this.x -= x;
        this.y -= y;
        return this;
    }

    /**
     * 乘
     * @param vec
     * @returns
     */
    public mul(vec: SZVec2): SZVec2 {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    }

    /**
     * 乘
     * @param x
     * @param y
     * @returns
     */
    public mul2f(x: number, y: number): SZVec2 {
        this.x *= x;
        this.y *= y;
        return this;
    }

    /**
     * 除
     * @param vec
     * @returns
     */
    public div(vec: SZVec2): SZVec2 {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }

    /**
     * 除
     * @param x
     * @param y
     * @returns
     */
    public div2f(x: number, y: number): SZVec2 {
        this.x /= x;
        this.y /= y;
        return this;
    }

    /**
     * 判断是否相等
     * @param vec
     * @param epsilon
     * @returns
     */
    public equals(vec: SZVec2, epsilon?: number): boolean {
        if (epsilon != undefined) {
            return Math.abs(this.x - vec.x) < epsilon && Math.abs(this.y - vec.y) < epsilon;
        }
        return this.x == vec.x && this.y == vec.y;
    }

    /**
     * 判断是否相等
     * @param x
     * @param y
     * @param epsilon
     * @returns
     */
    public equals2f(x: number, y: number, epsilon?: number): boolean {
        if (epsilon != undefined) {
            return Math.abs(this.x - x) < epsilon && Math.abs(this.y - y) < epsilon;
        }
        return this.x == x && this.y == y;
    }

    /**
     * 单位化向量
     * @returns
     */
    public normalize(): SZVec2 {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    /**
     * 缩放向量
     * @param scale
     * @returns
     */
    public scaler(scale: number) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    /**
     * 向量取反
     * @returns
     */
    public negative(): SZVec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * 线性向量插值
     * @param vec
     * @param t
     * @returns
     */
    public lerp(vec: SZVec2, t: number): SZVec2 {
        this.x += (vec.x - this.x) * t;
        this.y += (vec.y - this.y) * t;
        return this;
    }

    /**
     * 向量点乘
     * @param vec
     * @returns
     */
    public dot(vec: SZVec2): number {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * 向量点乘
     * @param x
     * @param y
     * @returns
     */
    public dot2f(x: number, y: number): number {
        return this.x * x + this.y * y;
    }

    /**
     * 向量叉乘
     * @param vec
     * @returns
     */
    public cross(vec: SZVec2): number {
        return this.x * vec.y - this.y * vec.x;
    }

    /**
     * 向量叉乘
     * @param x
     * @param y
     * @returns
     */
    public cross2f(x: number, y: number): number {
        return this.x * y - this.y * x;
    }

    /**
     * 在指定向量上的投影
     * @param vec
     * @returns
     */
    public project(vec: SZVec2): SZVec2 {
        const rate = this.dot(vec) / vec.length();
        return new SZVec2(vec.x * rate, vec.y * rate);
    }

    /**
     * 在指定向量上的投影
     * @param x
     * @param y
     * @returns
     */
    public project2f(x: number, y: number): SZVec2 {
        const rate = this.dot2f(x, y) / this.length();
        return new SZVec2(this.x * rate, this.y * rate);
    }

    /**
     * 与x轴正半轴的夹角(-pi, pi]
     * @returns
     */
    public radian(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * 与指定向量的夹角(-pi, pi]
     * @param vec
     * @returns
     */
    public radian2(vec: SZVec2): number {
        return Math.atan2(vec.y - this.y, vec.x - this.x);
    }

    /**
     * 与指定向量的夹角(-pi, pi]
     * @param x
     * @param y
     * @returns
     */
    public radian2f(x: number, y: number): number {
        return Math.atan2(y - this.y, x - this.x);
    }

    /**
     * 旋转向量
     * @param radian
     * @returns
     */
    public rotate(radian: number): SZVec2 {
        const sinRad = Math.sin(radian);
        const cosRad = Math.cos(radian);
        const x = this.x * cosRad - this.y * sinRad;
        const y = this.x * sinRad + this.y * cosRad;
        this.x = x;
        this.y = y;
        return this;
    }
}

/**
 * 3维向量
 */
export class SZVec3 {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    constructor(x?: number, y?: number, z?: number) {
        if (x) {
            this.x = x;
        }

        if (y) {
            this.y = y;
        }

        if (z) {
            this.z = z;
        }
    }

    // 零向量
    public static readonly ZERO = new SZVec3(0, 0, 0);

    // x正半轴
    public static readonly UNIT_X = new SZVec3(1, 0, 0);

    // x负半轴
    public static readonly UNIT_NEG_X = new SZVec3(-1, 0, 0);

    // y正半轴
    public static readonly UNIT_Y = new SZVec3(0, 1, 0);

    // y负半轴
    public static readonly UNIT_NEG_Y = new SZVec3(0, -1, 0);

    // z正半轴
    public static readonly UNIT_Z = new SZVec3(0, 0, 1);

    // z负半轴
    public static readonly UNIT_NEG_Z = new SZVec3(0, 0, -1);

    // 单位向量
    public static readonly ONE = new SZVec3(1, 1, 0);

    // 单位负向量
    public static readonly NEG_ONE = new SZVec3(-1, -1, -1);

    /**
     * 克隆
     * @returns
     */
    public clone(): SZVec3 {
        return new SZVec3(this.x, this.y, this.z);
    }

    /**
     * 向量长度
     * @returns
     */
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 加
     * @param vec
     * @returns
     */
    public add(vec: SZVec3): SZVec3 {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    /**
     * 加
     * @param x
     * @param y
     * @param z
     * @returns
     */
    public add3f(x: number, y: number, z: number): SZVec3 {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    /**
     * 减
     * @param vec
     * @returns
     */
    public sub(vec: SZVec3): SZVec3 {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }

    /**
     * 减法
     * @param x
     * @param y
     * @param z
     * @returns
     */
    public sub2f(x: number, y: number, z: number): SZVec3 {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    /**
     * 乘
     * @param vec
     * @returns
     */
    public mul(vec: SZVec3): SZVec3 {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
        return this;
    }

    /**
     * 乘
     * @param x
     * @param y
     * @param z
     * @returns
     */
    public mul3f(x: number, y: number, z: number): SZVec3 {
        this.x *= x;
        this.y *= y;
        this.z *= z;
        return this;
    }

    /**
     * 除
     * @param vec
     * @returns
     */
    public div(vec: SZVec3): SZVec3 {
        this.x /= vec.x;
        this.y /= vec.y;
        this.z / vec.z;
        return this;
    }

    /**
     * 除
     * @param x
     * @param y
     * @param z
     * @returns
     */
    public div3f(x: number, y: number, z: number): SZVec3 {
        this.x /= x;
        this.y /= y;
        this.z /= z;
        return this;
    }

    /**
     * 判断是否相等
     * @param vec
     * @param epsilon
     * @returns
     */
    public equals(vec: SZVec3, epsilon?: number): boolean {
        if (epsilon != undefined) {
            return Math.abs(this.x - vec.x) < epsilon && Math.abs(this.y - vec.y) < epsilon && Math.abs(this.z - vec.z) < epsilon;
        }
        return this.x == vec.x && this.y == vec.y && this.z == vec.z;
    }

    /**
     * 判断是否相等
     * @param x
     * @param y
     * @param z
     * @param epsilon
     * @returns
     */
    public equals3f(x: number, y: number, z: number, epsilon?: number): boolean {
        if (epsilon != undefined) {
            return Math.abs(this.x - x) < epsilon && Math.abs(this.y - y) < epsilon && Math.abs(this.z - z) < epsilon;
        }
        return this.x == x && this.y == y && this.z == z;
    }

    /**
     * 单位化向量
     * @returns
     */
    public normalize(): SZVec3 {
        const len = this.length();
        if (len > 0) {
            this.x /= len;
            this.y /= len;
            this.z /= len;
        }
        return this;
    }

    /**
     * 缩放向量
     * @param scale
     * @returns
     */
    public scaler(scale: number) {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }

    /**
     * 向量取反
     * @returns
     */
    public negative(): SZVec3 {
        this.x = -this.x;
        this.y = -this.y;
        this.y = -this.y;
        return this;
    }

    /**
     * 线性向量插值
     * @param vec
     * @param t
     * @returns
     */
    public lerp(vec: SZVec3, t: number): SZVec3 {
        this.x += (vec.x - this.x) * t;
        this.y += (vec.y - this.y) * t;
        this.z += (vec.z - this.z) * t;
        return this;
    }
}
