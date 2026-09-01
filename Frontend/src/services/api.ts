import { BattleApiResponse } from '../types/battle';

export interface BattleRequestOptions {
  apiUrl?: string;
  forceSimulation?: boolean;
  timeoutMs?: number;
}

/**
 * Initiates an AI Battle through the backend LangGraph API with fallback simulation.
 */
export async function executeBattleApi(
  problem: string,
  options: BattleRequestOptions = {}
): Promise<BattleApiResponse> {
  const {
    apiUrl = '/api',
    forceSimulation = false,
    timeoutMs = 90000,
  } = options;

  if (forceSimulation) {
    return generateSimulatedBattle(problem);
  }

  // Attempt real backend call
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response: Response | null = null;
    let errorDetails = '';

    // First attempt: POST /api with problem/message
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ message: problem, problem: problem }),
        signal: controller.signal,
      });
    } catch (e: unknown) {
      const err = e as Error;
      errorDetails = err.message || 'POST request failed';
    }

    // Second attempt if POST failed or 404/405 (in case backend is GET /api)
    if (!response || !response.ok) {
      try {
        const getUrl = apiUrl.includes('?') 
          ? `${apiUrl}&problem=${encodeURIComponent(problem)}`
          : `${apiUrl}?problem=${encodeURIComponent(problem)}&message=${encodeURIComponent(problem)}`;
        
        response = await fetch(getUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: controller.signal,
        });
      } catch (getErr: unknown) {
        const err = getErr as Error;
        errorDetails += ` | GET request failed: ${err.message}`;
      }
    }

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      
      // Validate schema
      if (isValidBattleResponse(data)) {
        return {
          problem: data.problem || problem,
          solution_1: data.solution_1 || 'No solution provided by Model 1.',
          solution_2: data.solution_2 || 'No solution provided by Model 2.',
          judge: {
            solution_1_score: Number(data.judge?.solution_1_score ?? 0),
            solution_2_score: Number(data.judge?.solution_2_score ?? 0),
            solution_1_reasoning: String(data.judge?.solution_1_reasoning ?? 'No reasoning provided.'),
            solution_2_reasoning: String(data.judge?.solution_2_reasoning ?? 'No reasoning provided.'),
          },
        };
      }
    }

    // If backend did not return valid format or returned an error status
    throw new Error(
      `Backend responded with invalid battle structure (Status: ${response?.status || 'unreachable'}). Details: ${errorDetails || 'Check server connection.'}`
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as Error;
    if (error.name === 'AbortError') {
      throw new Error('Battle request timed out after 90 seconds. AI models may be overloaded.');
    }
    throw error;
  }
}

function isValidBattleResponse(data: unknown): data is BattleApiResponse {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.solution_1 === 'string' &&
    typeof d.solution_2 === 'string' &&
    typeof d.judge === 'object' &&
    d.judge !== null
  );
}

/**
 * High-quality contextual simulation engine for testing & demonstration
 */
export async function generateSimulatedBattle(problem: string): Promise<BattleApiResponse> {
  // Simulate network latency of AI generation
  await new Promise((resolve) => setTimeout(resolve, 2400));

  const lower = problem.toLowerCase();

  // Code / Algorithm related prompt
  if (lower.includes('code') || lower.includes('algorithm') || lower.includes('function') || lower.includes('typescript') || lower.includes('python') || lower.includes('limiter')) {
    return {
      problem,
      solution_1: `### Mistral Solution: Production-Grade Implementation

Here is an optimized, thread-safe implementation focusing on O(1) time complexity and memory locality:

\`\`\`typescript
export interface RateLimitConfig {
  capacity: number;
  refillPerSecond: number;
}

export class AtomicTokenBucket {
  private tokens: number;
  private lastRefillTimestamp: number;
  private readonly capacity: number;
  private readonly refillRate: number;

  constructor({ capacity, refillPerSecond }: RateLimitConfig) {
    this.capacity = capacity;
    this.refillRate = refillPerSecond;
    this.tokens = capacity;
    this.lastRefillTimestamp = performance.now();
  }

  public tryConsume(tokensRequested: number = 1): boolean {
    const now = performance.now();
    const elapsedSeconds = (now - this.lastRefillTimestamp) / 1000;
    
    // Continuous dynamic refill
    this.tokens = Math.min(this.capacity, this.tokens + (elapsedSeconds * this.refillRate));
    this.lastRefillTimestamp = now;

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }
}
\`\`\`

#### Key Architectural Highlights:
1. **Zero Heap Allocation on Hot Path:** Uses high-resolution \`performance.now()\` timestamps.
2. **Deterministic Drift Elimination:** Refills proportional to fractional seconds rather than interval timers.`,
      solution_2: `### Cohere Solution: Rate Limiting Concept

Rate limiting is essential for protecting backend APIs from DDoS attacks and noisy neighbors.

\`\`\`typescript
function checkRateLimit(userRequests: number, limit: number) {
  if (userRequests > limit) {
    return { status: 429, message: "Too many requests" };
  }
  return { status: 200, message: "Allowed" };
}
\`\`\`

#### Overview:
- Token Bucket lets bursts through up to bucket size.
- Leaky Bucket smooths out traffic evenly.
- Fixed Window counter is easy to implement with Redis INCR.`,
      judge: {
        solution_1_score: 9.6,
        solution_2_score: 4.5,
        solution_1_reasoning: 'Mistral provided a complete, functional, type-safe TypeScript implementation of the Token Bucket algorithm with high-precision timestamp delta math. Cohere only wrote an abstract helper function and high-level bullet points.',
        solution_2_reasoning: 'Cohere failed to implement the actual token bucket math, omitting state tracking, refill logic, and timestamps.',
      },
    };
  }

  // General text / analytical prompt
  return {
    problem,
    solution_1: `### Mistral Analytical Framework

In addressing **"${problem.slice(0, 60)}..."**, we must examine three foundational pillars:

#### 1. Core Principles & Theoretical Foundation
- **Mechanistic Determinism:** Systemic interactions must be evaluated by identifying primary input constraints, state vectors, and boundary conditions.
- **Efficiency Vectors:** Minimizing redundant computational or cognitive cycles while maximizing informational throughput.

#### 2. Practical Execution Strategy
1. **Deconstruct Requirements:** Isolate high-impact variables from environmental noise.
2. **Synthesize Modular Components:** Build decoupled systems with unambiguous interfaces.
3. **Continuous Benchmarking:** Verify hypotheses through empirical testing and telemetry.

#### 3. Summary Recommendation
Prioritize modular design, strict invariant verification, and low-latency feedback loops.`,
    solution_2: `### Cohere Comprehensive Analysis

When analyzing this topic, it is helpful to look at both the conceptual background and practical considerations.

#### Key Factors:
- **Scalability:** The ability of the approach to handle growth over time without degradation.
- **Usability:** Ensuring that operators and end-users can leverage the solution intuitively.
- **Trade-offs:** Every design decision introduces compromises between speed, simplicity, and flexibility.

#### Conclusion:
A balanced approach that factors in both immediate needs and long-term maintainability provides the greatest overall value.`,
    judge: {
      solution_1_score: 9.1,
      solution_2_score: 6.8,
      solution_1_reasoning: 'Mistral structured the answer into clean methodological layers with actionable steps and clear nomenclature.',
      solution_2_reasoning: 'Cohere provided sound high-level guidelines, though slightly generic without deep domain-specific examples.',
    },
  };
}
