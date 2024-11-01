import Handler_Event from "./Handler_Event";

export default class Handler_Environment {
  private static instance: Handler_Environment;
  private environment: any;
  private handler_event: Handler_Event;

  private constructor(handler_event: Handler_Event) {
    this.handler_event = handler_event;
  }

  public static getInstance(
    handler_event?: Handler_Event
  ): Handler_Environment {
    if (!Handler_Environment.instance && handler_event) {
      Handler_Environment.instance = new Handler_Environment(handler_event);
    }

    return Handler_Environment.instance;
  }

  // Since constructors can't be async, use a static initialization method
  public static async initialize(environment_path: string): Promise<boolean> {
    const handler_environment = Handler_Environment.getInstance();
    try {
      const response = await fetch(environment_path);
      const response_json = await response.json();
      handler_environment.environment = response_json;
      handler_environment.handler_event.subscribe(
        "environment_call",
        (payload: Payload_Environment_Call) => {
          let answer = [];

          if (typeof payload.key_environment === "string") {
            answer.push(
              handler_environment.sanitizedObjectLookUp({
                fallback: payload.fallback,
                path: payload.path,
                key_environment: payload.key_environment,
              })
            );
          } else {
            payload.key_environment?.forEach((key: string) => {
              answer.push(
                handler_environment.sanitizedObjectLookUp({
                  fallback: payload.fallback,
                  path: payload.path,
                  key_environment: key,
                })
              );
            });
          }

          handler_environment.handler_event.publish("environment_answer", {
            key_call: payload.key_call,
            data: answer,
          });
        }
      );

      await this.assetsPreLoad(handler_environment.environment);

      return true;
    } catch {
      // Use Error_Handler to notify about the initialization error
      handler_environment.notifyLog({
        status_code: 500,
        description: `Initialization failed.`,
      });
      return false;
    }
  }

  private notifyLog(log: Payload_Log) {
    this.handler_event.publish("log", log);
  }

  private static async assetsPreLoad(environment: any) {
    const assetPromises = environment.subscriber_content.assets.map(
      (asset: Asset) => {
        if (asset.url) return this.loadAsset(asset.url);
      }
    );

    await Promise.all(assetPromises);
    console.log("All assets preloaded successfully.");
  }

  private static loadAsset(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => resolve();
      image.onerror = reject;
    });
  }

  public sanitizedObjectLookUp(payload: Payload_Environment_Sanitized) {
    const result = this.objectLookUp({
      path: payload.path,
      key_environment: payload.key_environment,
    });

    if (result === undefined) {
      // Notify using Error_Handler
      this.notifyLog({
        status_code: 404,
        description: `Requested object at ${payload.path}, ${payload.key_environment} not found; Fallback used.`,
      });
      return payload.fallback;
    } else {
      return result;
    }
  }

  private returnDataByKey(array_environment: any[], key_environment: string) {
    return array_environment.find((obj) =>
      Object.keys(obj).some(
        (env_key) =>
          env_key.startsWith("key_") && obj[env_key] === key_environment
      )
    );
  }

  private objectLookUp(payload: Payload_Environment): any {
    // Traverse the JSON object using the path
    let env = this.environment;

    for (const part of payload.path) {
      if (env && env[part]) {
        env = env[part];
      } else {
        // Path not found
        return undefined;
      }
    }

    if (Array.isArray(env) && payload.key_environment !== undefined) {
      // Search through the array for an object with the specific key-value pair
      const foundObject = this.returnDataByKey(
        env,
        payload.key_environment as string
      );

      return foundObject ? foundObject : undefined;
    } else {
      return env;
    }
  }
}
