
/**
 * Client-side rate limiting utility
 */

interface RateLimitOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
  storageKey?: string;
}

interface RateLimitState {
  count: number;
  timestamp: number;
}

/**
 * Client-side rate limiter to prevent excessive requests
 */
export class RateLimiter {
  private options: RateLimitOptions;
  private storageKey: string;
  
  constructor(options: RateLimitOptions) {
    this.options = {
      maxRequests: options.maxRequests,
      timeWindow: options.timeWindow,
      storageKey: options.storageKey || 'rate-limit'
    };
    this.storageKey = `nutrisnap-${this.options.storageKey}`;
  }
  
  /**
   * Check if the action can be performed without exceeding rate limit
   * @returns True if action is allowed, false if rate limited
   */
  public canPerformAction(): boolean {
    const state = this.getCurrentState();
    const now = Date.now();
    
    // Reset counter if time window has passed
    if (now - state.timestamp > this.options.timeWindow) {
      this.resetState();
      return true;
    }
    
    // Check if max requests reached
    return state.count < this.options.maxRequests;
  }
  
  /**
   * Record that an action was performed
   */
  public recordAction(): void {
    const state = this.getCurrentState();
    const now = Date.now();
    
    // Reset counter if time window has passed
    if (now - state.timestamp > this.options.timeWindow) {
      this.setState({
        count: 1,
        timestamp: now
      });
      return;
    }
    
    // Increment counter
    this.setState({
      count: state.count + 1,
      timestamp: state.timestamp
    });
  }
  
  /**
   * Get remaining time before rate limit resets (in ms)
   */
  public getResetTime(): number {
    const state = this.getCurrentState();
    const now = Date.now();
    const elapsed = now - state.timestamp;
    const remaining = Math.max(0, this.options.timeWindow - elapsed);
    
    return remaining;
  }
  
  /**
   * Get number of requests remaining in current window
   */
  public getRemainingRequests(): number {
    const state = this.getCurrentState();
    const now = Date.now();
    
    // Reset counter if time window has passed
    if (now - state.timestamp > this.options.timeWindow) {
      return this.options.maxRequests;
    }
    
    return Math.max(0, this.options.maxRequests - state.count);
  }
  
  /**
   * Reset the rate limit state
   */
  public resetState(): void {
    this.setState({
      count: 0,
      timestamp: Date.now()
    });
  }
  
  private getCurrentState(): RateLimitState {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        return { count: 0, timestamp: Date.now() };
      }
      
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error reading rate limit state:', error);
      return { count: 0, timestamp: Date.now() };
    }
  }
  
  private setState(state: RateLimitState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving rate limit state:', error);
    }
  }
}

// Export pre-configured limiters for common operations
export const aiAnalysisLimiter = new RateLimiter({
  maxRequests: 5,
  timeWindow: 60 * 1000, // 1 minute
  storageKey: 'ai-analysis'
});

export const fileUploadLimiter = new RateLimiter({
  maxRequests: 10,
  timeWindow: 60 * 1000, // 1 minute
  storageKey: 'file-upload'
});

export const apiRequestLimiter = new RateLimiter({
  maxRequests: 20,
  timeWindow: 60 * 1000, // 1 minute
  storageKey: 'api-request'
});

/**
 * Utility function to enforce rate limiting in async functions
 * @param limiter RateLimiter instance
 * @param action Async function to execute
 * @param errorMessage Error message if rate limited
 */
export async function withRateLimiting<T>(
  limiter: RateLimiter,
  action: () => Promise<T>,
  errorMessage: string = 'Rate limit exceeded. Please try again later.'
): Promise<T> {
  if (!limiter.canPerformAction()) {
    const resetTime = limiter.getResetTime();
    const seconds = Math.ceil(resetTime / 1000);
    throw new Error(`${errorMessage} Try again in ${seconds} seconds.`);
  }
  
  try {
    const result = await action();
    limiter.recordAction();
    return result;
  } catch (error) {
    // Don't increment counter on errors
    throw error;
  }
}
