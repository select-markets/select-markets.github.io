import Handler_Event from "./Handler_Event";

enum Level_Log {
  TRACE = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export default class Handler_Log {
  private static instance: Handler_Log;
  private handler_event: Handler_Event;
  private level_log: Level_Log;

  private constructor(
    handler_event: Handler_Event,
    level_log: Level_Log = Level_Log.ERROR
  ) {
    this.handler_event = handler_event;
    this.handler_event.subscribe("log", this.newLog.bind(this));
    this.level_log = level_log;
  }

  public static getInstance(handler_event?: Handler_Event): Handler_Log {
    if (!Handler_Log.instance && handler_event) {
      Handler_Log.instance = new Handler_Log(handler_event);
    }

    return Handler_Log.instance;
  }

  private newLog(log: Payload_Log, toStore: boolean = false) {
    let timed_log: Payload_Log = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    switch (this.level_log) {
      case Level_Log.ERROR:
      case Level_Log.WARN:
        if (log.status_code !== 0) {
          console.error(timed_log);
        }
        if (toStore) this.storeLog(timed_log);
        break;
      case Level_Log.INFO:
      case Level_Log.TRACE:
        console.log(timed_log);
        if (toStore) this.storeLog(timed_log);
        break;
    }
  }

  private storeLog(log: Payload_Log) {
    this.handler_event.publish("api_call", {
      key_api: "log",
      key_call: "Handler_Log",
      data: {
        level_log: this.level_log,
        log: log,
      },
    });
  }
}
