/**
 * Unified System Hub
 *
 * A small in-process event bus for the client. Pages publish lifecycle
 * events and subscribe to domain events without importing each other.
 *
 * Scope: this hub delivers events inside one browser tab only. It does
 * not open a WebSocket, call the server, persist events, or cross process
 * boundaries. A page that needs server fan-out must use the API or the
 * WebSocket hook separately.
 */

export type SystemEventPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SystemEvent<T = unknown> {
  id: string;
  timestamp: Date;
  source: string;
  type: string;
  data?: T;
  priority?: SystemEventPriority;
  propagate?: boolean;
}

export type SystemEventHandler<T = unknown> = (
  data: T,
  event: SystemEvent<T>
) => void;

class UnifiedSystemHub {
  private readonly handlers = new Map<string, Set<SystemEventHandler<any>>>();
  private readonly history: SystemEvent[] = [];
  private readonly maxHistory = 500;

  /**
   * Publish an event to every handler registered for its type.
   *
   * A handler that throws is logged and does not prevent the other
   * handlers from receiving the event.
   */
  publishEvent<T>(event: SystemEvent<T>): void {
    this.history.push(event as SystemEvent);
    if (this.history.length > this.maxHistory) {
      this.history.splice(0, this.history.length - this.maxHistory);
    }

    for (const type of [event.type, '*']) {
      const handlers = this.handlers.get(type);
      if (!handlers) continue;

      for (const handler of Array.from(handlers)) {
        try {
          handler(event.data, event);
        } catch (error) {
          console.error(
            `[UnifiedSystemHub] handler for "${event.type}" failed:`,
            error
          );
        }
      }
    }
  }

  /**
   * Subscribe to an event type. Returns an unsubscribe function.
   */
  on<T = unknown>(type: string, handler: SystemEventHandler<T>): () => void {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = new Set();
      this.handlers.set(type, handlers);
    }
    handlers.add(handler as SystemEventHandler<any>);
    return () => this.off(type, handler);
  }

  /**
   * Remove a previously registered handler.
   */
  off<T = unknown>(type: string, handler: SystemEventHandler<T>): void {
    const handlers = this.handlers.get(type);
    if (!handlers) return;
    handlers.delete(handler as SystemEventHandler<any>);
    if (handlers.size === 0) {
      this.handlers.delete(type);
    }
  }

  /**
   * Subscribe for a single delivery.
   */
  once<T = unknown>(type: string, handler: SystemEventHandler<T>): () => void {
    const unsubscribe = this.on<T>(type, (data, event) => {
      unsubscribe();
      handler(data, event);
    });
    return unsubscribe;
  }

  /**
   * Return a copy of the recent event history, optionally filtered.
   */
  getHistory(type?: string): SystemEvent[] {
    const events = type
      ? this.history.filter(event => event.type === type)
      : this.history;
    return events.slice();
  }

  /**
   * Drop all handlers and history.
   */
  clear(): void {
    this.handlers.clear();
    this.history.length = 0;
  }
}

export const unifiedSystemHub = new UnifiedSystemHub();

export default unifiedSystemHub;
