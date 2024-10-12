export default class Handler_Event {
  private event_subscriptions: Map_Event;
  private static instance: Handler_Event;

  private constructor() {
    this.event_subscriptions = {} as Map_Event;
  }

  public static getInstance(): Handler_Event {
    if (!Handler_Event.instance) {
      Handler_Event.instance = new Handler_Event();
    }

    return Handler_Event.instance;
  }

  public subscribe(event: Key_Events, callback: Function): void {
    if (!this.event_subscriptions[event]) {
      this.event_subscriptions[event] = { callbacks: [] };
    }

    this.event_subscriptions[event].callbacks.push(callback);

    // If data is already published for this event, trigger the callback immediately
    if (this.event_subscriptions[event].data !== undefined) {
      callback(this.event_subscriptions[event].data);
    }
  }

  public unsubscribe(event: Key_Events, callback: Function): void {
    if (!this.event_subscriptions[event]) return;

    this.event_subscriptions[event].callbacks = this.event_subscriptions[
      event
    ].callbacks.filter((subscriber) => subscriber !== callback);
  }

  public publish(event: Key_Events, data: any): boolean {
    if (!this.event_subscriptions[event]) {
      this.event_subscriptions[event] = { callbacks: [], data: data };
      return false;
    }

    this.event_subscriptions[event].data = data;
    const eventCallbacks = this.event_subscriptions[event].callbacks;

    if (eventCallbacks.length > 0) {
      eventCallbacks.forEach((callback) => {
        callback(data);
      });
      return true;
    }

    return false;
  }
}
