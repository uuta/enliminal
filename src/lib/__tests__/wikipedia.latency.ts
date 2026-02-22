import { fetchRandomKeyword } from "@/lib/wikipedia";

const t0 = performance.now();
const result = await fetchRandomKeyword();
const latency = performance.now() - t0;

console.log(`[wikipedia] latency: ${latency.toFixed(0)}ms`);
console.log(`title: ${result.title}`);
