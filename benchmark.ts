import { Bench } from "tinybench";
import { tzScan } from "./src/index.js";

const bench = new Bench({ time: 3000 });

const duration = {
  start: new Date("2020-01-01T00:00:00Z"),
  end: new Date("2020-12-31T00:00:00Z"),
};

bench
  .add("tzScane", () => {
    tzScan("America/New_York", duration);
  })
  .todo("unimplemented bench");

await bench.warmup();
await bench.run();

console.table(bench.table());
