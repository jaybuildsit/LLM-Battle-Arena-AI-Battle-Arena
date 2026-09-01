import { BattleRecord, ModelInfo } from '../types/battle';

export const COMPETITOR_MODELS: Record<'model_1' | 'model_2' | 'judge', ModelInfo> = {
  model_1: {
    id: 'mistral-medium',
    name: 'Mistral',
    version: 'mistral-medium-latest',
    provider: 'Mistral AI',
    color: 'from-orange-500 to-amber-500',
    accentHex: '#f97316',
    borderGlow: 'border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    bgGlow: 'bg-orange-500/10',
    description: 'Specialized in high-reasoning, concise code synthesis, and structured analytical responses.',
    strengths: ['Algorithmic Logic', 'Conciseness', 'Low Latency'],
    role: 'competitor',
  },
  model_2: {
    id: 'cohere-command',
    name: 'Cohere',
    version: 'command-a-vision-07-2025',
    provider: 'Cohere',
    color: 'from-cyan-500 to-blue-500',
    accentHex: '#06b6d4',
    borderGlow: 'border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    bgGlow: 'bg-cyan-500/10',
    description: 'Engineered for enterprise comprehension, deep context ingestion, and nuanced explanations.',
    strengths: ['Contextual Depth', 'Instruction Following', 'Technical Clarity'],
    role: 'competitor',
  },
  judge: {
    id: 'gemini-flash',
    name: 'Gemini',
    version: 'gemini-3.6-flash',
    provider: 'Google DeepMind',
    color: 'from-purple-500 to-indigo-500',
    accentHex: '#a855f7',
    borderGlow: 'border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    bgGlow: 'bg-purple-500/10',
    description: 'Independent evaluation arbiter scoring across accuracy, reasoning rigor, completeness, and structure.',
    strengths: ['Unbiased Evaluation', 'Multi-turn Validation', 'Strict Rubric Enforcement'],
    role: 'judge',
  },
};

export const PRESET_PROMPTS = [
  {
    category: 'Architecture',
    label: 'Microservices vs Monolith',
    prompt: 'Compare Event-Driven Microservices vs Modular Monolith for a high-frequency fintech platform handling 50k req/sec. Discuss latency, database consistency, and failure modes.',
  },
  {
    category: 'Algorithms',
    label: 'Distributed Rate Limiter',
    prompt: 'Design a distributed rate limiter algorithm using Redis and Token Bucket. Write clean TypeScript pseudocode with concurrency considerations.',
  },
  {
    category: 'AI / ML',
    label: 'RAG vs Long Context',
    prompt: 'Critically analyze when Retrieval-Augmented Generation (RAG) outperforms 1M+ token context windows in production AI systems.',
  },
  {
    category: 'Philosophy',
    label: 'Consciousness vs Intelligence',
    prompt: 'Explain the philosophical distinction between subjective consciousness (phenomenology) and general intelligence (functional problem-solving).',
  },
];

export const INITIAL_BATTLE_HISTORY: BattleRecord[] = [
  {
    id: 'battle-001',
    timestamp: Date.now() - 1000 * 60 * 45,
    problem: 'Compare Event-Driven Microservices vs Modular Monolith for a high-frequency fintech platform.',
    model_1: 'Mistral',
    model_2: 'Cohere',
    judge_model: 'Gemini',
    solution_1: `### Architectural Assessment: High-Frequency Fintech Platform

When processing 50,000 req/sec in financial operations, trade-offs between latency, data consistency, and failure domains are paramount.

#### 1. Latency Profile
* **Modular Monolith:** Function calls within memory boundaries exhibit sub-millisecond execution (typically **<150µs**). No network serialization (gRPC/JSON) overhead.
* **Event-Driven Microservices:** Asynchronous Kafka/RabbitMQ broker hops introduce **5–25ms** tail latency, which is problematic for low-latency settlement matching.

#### 2. Data Consistency (ACID vs BASE)
* **Monolith:** Native 2-Phase Commit or Single RDBMS Transactional boundaries guarantee strict **ACID**, preventing ledger drift.
* **Event-Driven:** Requires **Saga Pattern** with compensating transactions. Eventual consistency risks intermediate un-reconciled account balances.

#### 3. Recommended Verdict
For high-frequency core ledgering: **Modular Monolith** with shared-nothing memory domains, offloading analytics to an asynchronous event stream.`,
    solution_2: `### Overview: Monolith vs Microservices

For a fintech system with 50k req/sec:

- **Microservices** offer independent team deployment and horizontal scaling of specific components (e.g. KYC service vs Trade Execution).
- **Monolith** keeps all database tables in one schema, making joins easy but creating a single point of failure if the database crashes.

#### Key Differences:
1. Microservices communicate over HTTP/Kafka.
2. Monolith scales as an entire unit.
3. Microservices require Kubernetes and distributed tracing.

**Conclusion:** Start with microservices if you have a team over 20 engineers.`,
    judge: {
      solution_1_score: 9.4,
      solution_2_score: 5.2,
      solution_1_reasoning: 'Mistral provided a rigorously technical response with concrete latency numbers (<150µs vs 5-25ms), explored ACID vs Saga patterns in financial ledgers, and delivered an actionable hybrid architecture.',
      solution_2_reasoning: 'Cohere gave a high-level general comparison without addressing the strict 50k req/sec latency constraints or the financial ledger consistency trade-offs asked in the prompt.',
    },
    winner: 'model_1',
    durationMs: 3820,
  },
  {
    id: 'battle-002',
    timestamp: Date.now() - 1000 * 60 * 180,
    problem: 'Design a distributed rate limiter algorithm using Redis and Token Bucket in TypeScript.',
    model_1: 'Mistral',
    model_2: 'Cohere',
    judge_model: 'Gemini',
    solution_1: `\`\`\`typescript
import Redis from "ioredis";

export class TokenBucketLimiter {
  private redis: Redis;
  private capacity: number;
  private refillRatePerSec: number;

  constructor(redis: Redis, capacity: number, refillRatePerSec: number) {
    this.redis = redis;
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
  }

  // Atomic Lua script executes in single tick to avoid race conditions
  async allowRequest(key: string, tokensRequested = 1): Promise<boolean> {
    const luaScript = \`
      local key = KEYS[1]
      local cap = tonumber(ARGV[1])
      local rate = tonumber(ARGV[2])
      local requested = tonumber(ARGV[3])
      local now = tonumber(ARGV[4])

      local data = redis.call("HMGET", key, "tokens", "last_updated")
      local tokens = tonumber(data[1]) or cap
      local last_updated = tonumber(data[2]) or now

      local elapsed = math.max(0, now - last_updated)
      tokens = math.min(cap, tokens + (elapsed * rate))

      if tokens >= requested then
        tokens = tokens - requested
        redis.call("HMSET", key, "tokens", tokens, "last_updated", now)
        redis.call("EXPIRE", key, math.ceil(cap / rate) * 2)
        return 1
      else
        return 0
      end
    \`;

    const nowSec = Date.now() / 1000;
    const result = await this.redis.eval(
      luaScript,
      1,
      \`rate_limit:\${key}\`,
      this.capacity,
      this.refillRatePerSec,
      tokensRequested,
      nowSec
    );

    return result === 1;
  }
}
\`\`\``,
    solution_2: `\`\`\`typescript
class RateLimiter {
  tokens: number = 100;
  lastRefill: number = Date.now();

  checkLimit(userId: string) {
    // In-memory token bucket check
    const now = Date.now();
    if (now - this.lastRefill > 1000) {
      this.tokens = 100;
      this.lastRefill = now;
    }
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}
\`\`\``,
    judge: {
      solution_1_score: 9.8,
      solution_2_score: 3.5,
      solution_1_reasoning: 'Mistral used an atomic Redis Lua script which is the standard industry practice for distributed rate limiting to avoid race conditions under concurrency. Provided complete TypeScript class with TTL expiration.',
      solution_2_reasoning: 'Cohere failed to use Redis and implemented an in-memory single-node counter that resets discretely (fixed window rather than continuous token bucket) and fails in distributed environments.',
    },
    winner: 'model_1',
    durationMs: 4100,
  },
];
