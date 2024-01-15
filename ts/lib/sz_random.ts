import { SZCOMMON } from "./sz_common";

/**
 * 线性同余随机数生成
 * 默认范围[0, 1)
 */
export class SZLinearCongruentialGenerator {
    private seed: number;
    private readonly a: number;
    private readonly c: number;
    private readonly m: number;

    constructor(seed: number, a: number = 1664525, c: number = 1013904223, m: number = Math.pow(2, 32)) {
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
export class MersenneTwisterGenerator {
    private readonly N: number = 624;
    private readonly M: number = 397;
    private readonly MATRIX_A: number = 0x9908b0df;
    private readonly UPPER_MASK: number = 0x80000000;
    private readonly LOWER_MASK: number = 0x7fffffff;

    private mt: number[] = new Array(this.N);
    private mti: number = this.N + 1;

    constructor(seed: number) {
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
}

/**
 * 带进位减随机数生成
 * 默认范围[0, 1)
 */
export class SZCarrySubtractGenerator {
    private readonly m: number;
    private readonly a: number;
    private readonly q: number;
    private readonly r: number;

    private x: number;
    private y: number;

    constructor(seed: number, m: number = Math.pow(2, 31) - 1, a: number = 16807) {
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
export class DiscreteDistributionGenerator {
    // 随机数引擎
    private gen_: SZLinearCongruentialGenerator;

    // 原始概率列表
    private probabilities_: number[];
    // 列加概率列表
    private cumulativeProbabilities_: number[];

    /**
     * 概率列表
     * @param probabilities
     */
    constructor(seed: number, probabilities: number[]) {
        if (probabilities.length == 0 || probabilities.some(p => p < 0)) {
            throw new Error("Invalid probabilities");
        }

        const sum = probabilities.reduce((acc, p) => acc + p, 0);
        if (sum == 0) {
            throw new Error("Probabilities must sum to a positive value");
        }

        this.gen_ = new SZLinearCongruentialGenerator(seed);

        let lastProb: number = 0;
        this.probabilities_ = probabilities.slice();
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
 * 整数列表离散概率分布
 * 以随机列表中的概率生成一个列表
 * 使生成列表之和为指定值
 */
export class SZIntegerListDistributionGenerator {
    // 最大调整次数
    private readonly MAX_REPAIR_TIMES = 3;

    // 最大波动范围
    private readonly MAX_FLUCTUATION_RANGE = 0.1;

    // 最小波动范围
    private readonly MIN_FLUCTUATION_RANGE = 0.0001;

    // 随机数引擎
    private gen_: SZLinearCongruentialGenerator;

    // 是否完全生成
    private bIsEntire_: boolean = false;
    // 总和
    private summary_: number = 0;
    // 波动范围
    private fluctuationRange: number = 0;
    // 列表长度
    private listLength_: number = 0;
    // 索引列表
    private indexList_: number[];
    // 概率列表
    private probabilities_: number[];
    // 期望列表
    private expectationProbabilities_: number[];

    /**
     * 构造
     * @param probabilities 概率列表
     * @param bIsEntire 是否完全生成，每个最少生成一个
     */
    constructor(seed: number, probabilities: number[], bIsEntire: boolean = false) {
        if (probabilities.length == 0 || probabilities.some(p => p < 0)) {
            throw new Error("Invalid probabilities");
        }

        const sum = probabilities.reduce((p, c) => p + c, 0);
        if (sum == 0) {
            throw new Error("Probabilities must sum to a positive value");
        }

        this.gen_ = new SZLinearCongruentialGenerator(seed);

        this.bIsEntire_ = bIsEntire;
        this.summary_ = probabilities.length;
        this.fluctuationRange = this.MAX_FLUCTUATION_RANGE;
        this.listLength_ = probabilities.length;
        this.indexList_ = new Array<number>(this.listLength_).fill(0).map((v, i) => {
            return i;
        });
        this.probabilities_ = probabilities.slice();
        this.expectationProbabilities_ = probabilities.map((v, i) => {
            return this.summary_ * v / sum;
        });
    }

    /**
     * 返回生成的数列
     * @param summary 生成列表数值的总和，必须为整数[probabilities.len, ~]
     * @returns
     */
    public next(summary: number): number[] {
        // 计算权重列表
        summary = Math.floor(summary);
        if (summary < this.listLength_) {
            throw new Error("Invalid summary");
        }

        if (this.summary_ != summary) {
            this.summary_ = summary;

            this.fluctuationRange = Math.min(this.MAX_FLUCTUATION_RANGE, Math.max(this.MIN_FLUCTUATION_RANGE, Math.sqrt(this.summary_) / this.summary_));
            const sum = this.probabilities_.reduce((p, c) => p + c, 0);
            this.expectationProbabilities_ = this.probabilities_.map((v, i) => {
                return this.summary_ * v / sum;
            });
        }

        let result = new Array<number>(this.listLength_);
        for (let i = 0; i < this.listLength_; i++) {
            if (!this.bIsEntire_ && this.expectationProbabilities_[i] == 0) {
                result[i] = 0;
                continue;
            }

            result[i] = Math.floor((this.gen_.next() * this.fluctuationRange * 2 + (1 - this.fluctuationRange)) * this.expectationProbabilities_[i]);
            if (this.bIsEntire_) {
                result[i] = Math.max(1, result[i]);
            }
        }

        // 分布修正
        let bIsOK = false;
        let repairTimes = 0;
        do {
            let sum = result.reduce((p, c) => p + c);
            let diff = this.summary_ - sum;
            if (diff == 0) {
                bIsOK = true;
                break;
            }
            repairTimes++;

            SZCOMMON.shuffle(this.indexList_);
            let step = Math.ceil(Math.abs(diff) / this.listLength_);
            for (let i of this.indexList_) {
                if (this.expectationProbabilities_[i] == 0) {
                    continue;
                }

                if (diff > 0) {
                    result[i] += step;
                    diff -= step;
                } else if (diff < 0) {
                    if (result[i] - step >= (this.bIsEntire_ ? 1 : 0)) {
                        result[i] -= step;
                        diff += step;
                    }
                } else {
                    break;
                }
            }
        } while (repairTimes < this.MAX_REPAIR_TIMES);

        // 最后的修正
        if (!bIsOK) {
            let sum = result.reduce((p, c) => p + c);
            let diff = this.summary_ - sum;
            if (diff != 0) {
                SZCOMMON.shuffle(this.indexList_);
                for (let i of this.indexList_) {
                    if (this.expectationProbabilities_[i] == 0) {
                        continue;
                    }
                    if (result[i] + diff >= (this.bIsEntire_ ? 1 : 0)) {
                        result[i] += diff;
                        break;
                    }
                }
            }
        }

        return result;
    }
}
