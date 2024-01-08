export namespace szdef {
    // 容器值类型
    export type CAPACITY_VALUE_TYPE<T> = T | undefined;
    // 容器默认初始大小
    export const DEFAULT_CAPACITY = 16;
    // 容器默认倍增系数
    export const DEFAULT_GROWTH_FACTOR = 1.5;

    // 浮点数精度
    export const EPSILON_FLOAT = 1.0E-6;

    // 每分钟秒数
    export const SECOND_AT_ONE_MINUTE = 60;
    // 每小时分钟数
    export const MINUTE_AT_ONE_HOUR = 60;
    // 每天小时数
    export const HOUR_AT_ONE_DAY = 24;
    // 每小时秒数
    export const SECOND_AT_ONE_HOUR = SECOND_AT_ONE_MINUTE * MINUTE_AT_ONE_HOUR;
    // 每天分钟数
    export const MINUTE_AT_ONE_DAY = MINUTE_AT_ONE_HOUR * HOUR_AT_ONE_DAY;
    // 每天秒数
    export const SECOND_AT_ONE_DAY = SECOND_AT_ONE_MINUTE * MINUTE_AT_ONE_HOUR * HOUR_AT_ONE_DAY;

    // 1 个
    export const ONE_MULTIPLE = 1;
    // 10 十
    export const TEN_MULTIPLE = 10;
    // 100 百
    export const HUNDRED_MULTIPLE = 100;
    // 1000 千
    export const THOUSAND_MULTIPLE = 1000;
    // 10000 万
    export const MYRIAD_MULTIPLE = 10000;
    // 1000000 百万
    export const MILLION_MULTIPLE = THOUSAND_MULTIPLE * THOUSAND_MULTIPLE;
    // 1000000000 十亿
    export const BILLION_MULTIPLE = MILLION_MULTIPLE * THOUSAND_MULTIPLE;
    // 1000000000000 万亿
    export const TRILLION_MULTIPLE = BILLION_MULTIPLE * THOUSAND_MULTIPLE;
    // 1000000000000000 千万亿
    export const QUADRILLION_MULTIPLE = TRILLION_MULTIPLE * THOUSAND_MULTIPLE;

    // 2^10
    export const KB = 1024;
    // 2^20
    export const MB = KB * KB;
    // 2^30
    export const GB = MB * KB;
    // 2^40
    export const TB = GB * KB;
    // 2^50
    export const PB = TB * KB;
} // namespace sz
