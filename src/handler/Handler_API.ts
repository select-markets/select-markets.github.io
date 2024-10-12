import Handler_Event from "./Handler_Event";

type Key_API_Types = "log";

interface Status {
  [key: string]: number;
}

export default class Handler_API {
  private static instance: Handler_API;
  private handler_event: Handler_Event;
  private url_api!: string;
  private initialized: boolean = false;
  private apiCallQueue: Payload_API_Call[] = [];
  private status_codes: Status = {
    success: 0,
    unauthorized: 401,
    internal: 500,
  };

  private API_Map: Record<Key_API_Types, Function> = {
    log: this.postLog,
  };

  private constructor(handler_event: Handler_Event) {
    this.handler_event = handler_event;
    this.handler_event.subscribe("api_call", (payload: Payload_API_Call) => {
      this.newCall(payload);
    });
  }

  public static getInstance(handler_event?: Handler_Event): Handler_API {
    if (!Handler_API.instance && handler_event) {
      Handler_API.instance = new Handler_API(handler_event);
    }

    return Handler_API.instance;
  }

  public static async initialize() {
    let handler = Handler_API.getInstance();

    handler.notifyLog({
      status_code: handler.status_codes.success,
      description: "Handler_API initialized",
    });

    handler.initialized = true;
    handler.runQueuedCalls();
  }

  private runQueuedCalls() {
    this.apiCallQueue.forEach((call) => this.processCall(call));
    this.apiCallQueue = [];
  }

  private notifyLog(log: Payload_Log) {
    this.handler_event.publish("log", log);
  }

  private newCall(api_call: Payload_API_Call) {
    if (!this.initialized) {
      this.apiCallQueue.push(api_call);
      this.notifyLog({
        status_code: this.status_codes.success,
        description: `Queued API method ${api_call.key_api}`,
      });
    } else {
      this.processCall(api_call);
    }
  }

  private processCall(api_call: Payload_API_Call) {
    const function_api: Function =
      this.API_Map[api_call.key_api as keyof typeof this.API_Map];

    if (function_api) {
      this.notifyLog({
        status_code: this.status_codes.success,
        description: `Executing API method ${api_call.key_api}`,
      });
      function_api.call(this, api_call);
    } else {
      this.notifyLog({
        status_code: this.status_codes.not_found,
        description: `API method ${api_call.key_api} not found`,
      });
    }
  }

  private newAnswer(payload: Payload_API_Call, answer: any) {
    this.handler_event.publish("api_answer", {
      key_call: payload.key_call,
      data: answer,
    });
  }

  private async callWithHandling(
    key_api: string,
    endpoint: string,
    request_options_method = "GET",
    request_data?: any,
    secret_key?: string
  ): Promise<any> {
    let url = this.url_api + endpoint;
    let response: any = {};
    let results: any = [{ ok: false, status: 404 }, undefined];

    let headers = {
      "Content-Type": "application/json",
      Authorization: secret_key,
    };

    const requestOptions: RequestInit = {
      method: request_options_method,
      headers: headers,
      ...(request_data && { body: JSON.stringify(request_data) }),
    };

    try {
      this.handler_event.publish("load", {
        key_call: `api_${key_api}`,
        finished: false,
      });

      response = await fetch(url, requestOptions);
      results = await Promise.all([response, response.json()]);

      if (this.isHTTPValid(response)) {
        this.notifyLog({
          status_code: this.status_codes.success,
          description: `Succeded API call to ${url}`,
        });

        this.handler_event.publish("load", {
          key_call: `api_${key_api}`,
          finished: true,
        });

        return results;
      }
    } catch (error) {
      this.notifyLog({
        status_code: this.status_codes.internal,
        description: `${error} at ${url}`,
      });
    }

    //this is a case where we have exhausted retries and not able to get an api successful result

    this.notifyLog({
      status_code: this.status_codes.unauthorized,
      description: `Exhausted number of API retries.`,
    });

    this.handler_event.publish("load", {
      key_call: `api_${key_api}`,
      finished: true,
    });

    return results;
  }

  private isHTTPValid(response_headers: any): boolean {
    if (!response_headers.ok) return false;

    return true;
  }

  private async templateCall(payload: Payload_API_Call) {
    let answer = {};

    const [response_headers, response_json] = await this.callWithHandling(
      payload.key_api,
      "preferences",
      "GET"
    );

    if (this.isHTTPValid(response_headers)) answer = response_json.Metadata[0];

    this.newAnswer(payload, {
      key_api: payload.key_api,
      data: answer,
    });
  }

  private async postLog(payload: Payload_API_Call) {
    const requestData: any = {
      LogLevel: payload.data.level_log,
      LogData: JSON.stringify(payload.data.log),
    };

    //await this.callWithHandling(payload.key_api, "log", "POST", requestData);

    return;
  }
}
