import { fetchRandomHNKeyword } from "@/lib/hackernews";

const t0 = performance.now();
const result = await fetchRandomHNKeyword();
const latency = performance.now() - t0;

console.log(`[hackernews] latency: ${latency.toFixed(0)}ms`);
console.log(`title: ${result.title}`);
