import { SZCOMMON } from "./lib/sz_common";
import { SZDATE } from "./lib/sz_datetime";

function getMonthDays(ms: number): number {
    let date = new Date(ms);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const days = new Date(year, month, 0).getDate();
    return days;
}

function main() {
    let ms = SZDATE.str2time("20040201", "%YYYY%MM%DD");

    let start = Date.now();
    for (let i = 0; i < 1000000; i++) {
        getMonthDays(ms);
        ms += 100;
    }
    let end = Date.now();
    console.log(end - start);
}

main();
