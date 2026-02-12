import { SZCOMMON } from "./sz_common";

abstract class SZRandomGenerator {
    /**
     * 生成下一个随机数
     * @returns 随机数
     */
    abstract next(): number;

    /**
     * 生成范围内的随机数 [min, max)
     * @param min 最小值
     * @param max 最大值
     * @returns 随机数
     */
    public range(min: number, max: number): number {
        return this.next() * (max - min) + min;
    }

    /**
     * 生成范围内的随机整数 [min, max)
     * @param min 最小值
     * @param max 最大值
     * @returns 随机整数
     */
    public rangeInt(min: number, max: number): number {
        return Math.floor(this.range(min, max));
    }
}

/**
 * 线性同余随机数生成
 * 默认范围[0, 1)
 */
export class SZLinearCongruentialGenerator extends SZRandomGenerator {
    private seed: number;
    private readonly a: number;
    private readonly c: number;
    private readonly m: number;

    constructor(seed: number, a: number = 1664525, c: number = 1013904223, m: number = Math.pow(2, 16)) {
        super();

        this.seed = seed;
        this.a = a;
        this.c = c;
        this.m = m;
    }

    public next(): number {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}

/**
 * 梅森缠绕器随机数生成
 * 默认范围[0, 1)
 */
export class SZMersenneTwisterGenerator extends SZRandomGenerator {
    private readonly N: number = 624;
    private readonly M: number = 397;
    private readonly MATRIX_A: number = 0x9908b0df;
    private readonly UPPER_MASK: number = 0x80000000;
    private readonly LOWER_MASK: number = 0x7fffffff;

    private mt: number[] = new Array(this.N);
    private mti: number = this.N + 1;

    constructor(seed: number) {
        super();

        this.init(seed);
    }

    private init(seed: number): void {
        this.mt[0] = seed >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((s & 0xffff0000) >>> 16) * 1812433253
                + (s & 0x0000ffff) * 1812433253
                + this.mti) >>> 0;
        }
    }

    private twist(): void {
        for (let i = 0; i < this.N; i++) {
            const x = (this.mt[i] & this.UPPER_MASK) + (this.mt[(i + 1) % this.N] & this.LOWER_MASK);
            let xa = x >>> 1;
            if (x % 2 != 0) {
                xa ^= this.MATRIX_A;
            }
            this.mt[i] = this.mt[(i + this.M) % this.N] ^ xa;
        }
        this.mti = 0;
    }

    public next(): number {
        if (this.mti >= this.N) {
            this.twist();
        }

        let y = this.mt[this.mti++];
        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;
        y = y >>> 0;

        return y / 0xffffffff;
    }
}

/**
 * 带进位减随机数生成
 * 默认范围[0, 1)
 */
export class SZCarrySubtractGenerator extends SZRandomGenerator {
    private readonly m: number;
    private readonly a: number;
    private readonly q: number;
    private readonly r: number;

    private x: number;
    private y: number;

    constructor(seed: number, m: number = Math.pow(2, 31) - 1, a: number = 16807) {
        super();

        this.m = m;
        this.a = a;
        this.q = Math.floor(m / a);
        this.r = m % a;

        this.x = seed;
        this.y = seed;
    }

    public next(): number {
        this.x = this.a * (this.x % this.q) - this.r * Math.floor(this.x / this.q);
        if (this.x < 0) {
            this.x += this.m;
        }

        this.y = this.x - this.y;
        if (this.y < 0) {
            this.y += this.m;
        }

        return this.y / this.m;
    }
}

/**
 * 依靠权重的随机概率分布
 * 产生区间 [0, ls.len) 上的随机整数
 * 每个数的概率为ls[i]/Sum(ls[i]);
 */
export class SZDiscreteDistributionGenerator extends SZRandomGenerator {
    // 随机数引擎
    private gen_: SZMersenneTwisterGenerator;

    // 列加概率列表
    private cumulativeProbabilities_: number[];

    /**
     * 概率列表
     * @param probabilities
     */
    constructor(seed: number, probabilities: number[]) {
        super();

        if (probabilities.length == 0 || probabilities.some(p => p < 0)) {
            throw new Error("Invalid probabilities");
        }

        const sum = probabilities.reduce((acc, p) => acc + p, 0);
        if (sum == 0) {
            throw new Error("Probabilities must sum to a positive value");
        }

        this.gen_ = new SZMersenneTwisterGenerator(seed);

        let lastProb: number = 0;
        this.cumulativeProbabilities_ = probabilities.map((v, i) => {
            let curProb = lastProb + v / sum;
            lastProb = curProb;
            return curProb;
        });
    }

    /**
     * 返回传入概率列表的索引
     * @returns
     */
    public next(): number {
        const rand = this.gen_.next();
        const index = this.cumulativeProbabilities_.findIndex(cp => cp >= rand);
        return index == -1 ? this.cumulativeProbabilities_.length - 1 : index;
    }
}

/**
 * 正态分布随机数生成
 * 默认范围[0, 1)
 */
export class SZNormalDistributionGenerator extends SZRandomGenerator {
    private seed: number;
    private spare: number | null = null;

    constructor(seed?: number) {
        super();

        // 如果没有提供种子，使用时间戳作为默认种子
        this.seed = seed ?? Math.floor(Date.now() * Math.random());
    }

    /** 线性同余生成器产生 [0,1) 的均匀分布 */
    private nextUniform(): number {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;
        this.seed = (a * this.seed + c) % m;
        return this.seed / m;
    }

    /** 将标准正态分布调整到 [0,1) 范围 */
    private adjust(z: number): number {
        // 调整参数：均值 0.5，标准差 0.15
        const adjusted = z * 0.15 + 0.5;
        // 截断到 [0, 1) 并防止精确等于 1
        return Math.min(Math.max(adjusted, 0), 1 - Number.EPSILON);
    }

    /**
     * 生成正态分布随机数
     * @returns
     */
    public next(): number {
        // 使用 Box-Muller 变换生成标准正态分布
        if (this.spare !== null) {
            const result = this.spare;
            this.spare = null;
            return this.adjust(result);
        }

        let u: number, v: number, s: number;
        do {
            u = this.nextUniform() * 2 - 1; // 转换为 [-1, 1)
            v = this.nextUniform() * 2 - 1;
            s = u * u + v * v;
        } while (s >= 1 || s === 0);

        const mul = Math.sqrt(-2 * Math.log(s) / s);
        const z0 = u * mul;  // 第一个正态分布值
        this.spare = v * mul; // 保存第二个值备用

        return this.adjust(z0);
    }
}

/**
 * 整数列表离散概率分布
 * 按给定概率生成整数列表，使列表元素之和为指定值
 */
export class SZIntegerListDistributionGenerator {
    private readonly MAX_REPAIR_TIMES = 3;
    private readonly MAX_FLUCTUATION_RANGE = 0.1;
    private readonly MIN_FLUCTUATION_RANGE = 0.0001;

    private readonly gen_: SZMersenneTwisterGenerator;
    private readonly bIsEntire_: boolean;
    private readonly listLength_: number;
    /** 概率之和，构造时计算一次，避免重复 reduce */
    private readonly probSum_: number;
    private readonly probabilities_: number[];
    /** 可参与修正的索引（期望 > 0），summary 变化时更新 */
    private adjustableIndices_: number[];

    private summary_: number = 0;
    private fluctuationRange_: number = 0;
    private expectationProbabilities_: number[] = [];

    /**
     * @param seed 随机种子
     * @param probabilities 概率列表（可未归一化）
     * @param bIsEntire 是否“完全生成”，即每项至少为 1
     */
    constructor(seed: number, probabilities: number[], bIsEntire: boolean = false) {
        if (probabilities.length === 0 || probabilities.some(p => p < 0)) {
            throw new Error("Invalid probabilities");
        }
        const sum = probabilities.reduce((a, b) => a + b, 0);
        if (sum === 0) {
            throw new Error("Probabilities must sum to a positive value");
        }

        this.gen_ = new SZMersenneTwisterGenerator(seed);
        this.bIsEntire_ = bIsEntire;
        this.listLength_ = probabilities.length;
        this.probSum_ = sum;
        this.probabilities_ = probabilities.slice();
        this.summary_ = this.listLength_;
        this.fluctuationRange_ = this.MAX_FLUCTUATION_RANGE;
        this.adjustableIndices_ = [];
        this.updateExpectationAndIndices();
    }

    /** summary 或初始状态变化时更新期望与可调整索引 */
    private updateExpectationAndIndices(): void {
        const s = this.summary_;
        this.expectationProbabilities_ = this.probabilities_.map(v => (s * v) / this.probSum_);
        this.adjustableIndices_ = this.expectationProbabilities_
            .map((v, i) => (v > 0 ? i : -1))
            .filter(i => i >= 0);
    }

    /**
     * 生成一组整数列表，和为 summary，各项按概率分布
     * @param summary 总和，整数且 >= probabilities.length
     */
    /**
     * 按概率分布生成整数列表，使元素之和等于 summary
     *
     * 流程概要：
     * 1. 若 summary 变化，则更新目标总和、波动区间和期望分布
     * 2. 按期望值加随机波动生成初值（bIsEntire 时每项至少为 1）
     * 3. 若初值之和与 summary 不等，则多轮按步长在可调整项上增减，使和逼近目标
     * 4. 若仍有残差，则一次性将残差加到一个合法项上，保证和严格等于 summary
     *
     * @param summary 目标总和（整数），须 >= 概率列表长度
     * @returns 长度为 probabilities.length 的整数数组，和为 summary
     */
    public next(summary: number): number[] {
        const target = Math.floor(summary);
        if (target < this.listLength_) {
            throw new Error("Invalid summary");
        }

        // summary 变化时：更新目标、波动区间，并重算期望与可调整索引
        if (this.summary_ !== target) {
            this.summary_ = target;
            this.fluctuationRange_ = Math.min(
                this.MAX_FLUCTUATION_RANGE,
                Math.max(this.MIN_FLUCTUATION_RANGE, Math.sqrt(this.summary_) / this.summary_)
            );
            this.updateExpectationAndIndices();
        }

        // 单元素下界：完全生成时为 1，否则为 0
        const minVal = this.bIsEntire_ ? 1 : 0;
        // 随机系数：r 在 [base, base+scale] = [1-fluctuation, 1+fluctuation]，使初值在期望附近波动
        const scale = 2 * this.fluctuationRange_;
        const base = 1 - this.fluctuationRange_;
        const result = new Array<number>(this.listLength_);
        const exp = this.expectationProbabilities_;

        // 按期望 × 随机系数生成初值；期望为 0 且非完全生成时直接置 0
        for (let i = 0; i < this.listLength_; i++) {
            if (!this.bIsEntire_ && exp[i] === 0) {
                result[i] = 0;
                continue;
            }
            const r = this.gen_.next() * scale + base;
            result[i] = Math.floor(r * exp[i]);
            if (this.bIsEntire_) {
                result[i] = Math.max(1, result[i]);
            }
        }

        let currentSum = result.reduce((a, b) => a + b, 0);
        let diff = this.summary_ - currentSum;
        let repairTimes = 0;
        const indices = this.adjustableIndices_;
        const n = indices.length;

        // 多轮修正：将 diff 按步长分摊到可调整项上（加或减），直至和为 summary 或达到最大轮数
        while (diff !== 0 && repairTimes < this.MAX_REPAIR_TIMES) {
            repairTimes++;
            SZCOMMON.shuffle(indices, () => this.gen_.next());
            const step = Math.ceil(Math.abs(diff) / n) || 1;

            for (const i of indices) {
                if (diff > 0) {
                    result[i] += step;
                    currentSum += step;
                    diff -= step;
                } else if (diff < 0 && result[i] - step >= minVal) {
                    result[i] -= step;
                    currentSum -= step;
                    diff += step;
                }
                if (diff === 0) break;
            }
        }

        // 若仍有残差：一次性加到一个满足下界约束的项上，保证和严格等于 summary
        if (diff !== 0) {
            SZCOMMON.shuffle(indices, () => this.gen_.next());
            for (const i of indices) {
                if (result[i] + diff >= minVal) {
                    result[i] += diff;
                    break;
                }
            }
        }

        return result;
    }
}
