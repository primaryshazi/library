/**
 * 2维向量
 */
export class SZVec2 {
    protected x_: number = 0;
    public get x(): number {
        return this.x_;
    }
    public set x(x: number) {
        this.x_ = x;
    }

    protected y_: number = 0;
    public get y(): number {
        return this.y_;
    }
    public set y(y: number) {
        this.y_ = y;
    }

    constructor(x?: number, y?: number) {
        if (x) {
            this.x_ = x;
        }

        if (y) {
            this.y_ = y;
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
     * 向量叉乘
     * @param vec
     * @returns
     */
    public cross(vec: SZVec2): number {
        return this.x * vec.y - this.y * vec.x;
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
