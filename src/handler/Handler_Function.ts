import map_function, { Map_Function } from "../functions/Functions";
import Handler_Event from "./Handler_Event";

type Key_Function_Types = "mount" | "unmount" | "lifecycle";

export default class Handler_Function {
  private handler_event: Handler_Event;
  private component_data: Data_Component_Generic;
  private setResults: (data: any) => void;

  public constructor(
    handler_event: Handler_Event,
    component_data: Data_Component_Generic,
    setResults: (data: any) => void
  ) {
    this.handler_event = handler_event;
    this.component_data = component_data;
    this.setResults = setResults;
  }

  private notifyLog(log: Payload_Log) {
    this.handler_event.publish("log", log);
  }

  private getFunction(key: string): Payload_Function {
    const keys = key.split(".");
    let current: Map_Function = map_function;

    for (const key of keys) {
      if (current[key] === undefined) {
        this.notifyLog({
          status_code: 404,
          description: `Requested Function ${key} in ${this.component_data.key_component} not found.`,
        });
        return () => {
          console.log(`Function: ${key} was not properly set up.`);
        };
      }
      current = current[key];
    }

    return current as Payload_Function;
  }

  private checkGeneralResult(data: Payload_Result) {
    return data.key_event_subscription[1] === undefined;
  }

  private checkSpecificResult(
    payload: Payload_Function_Data,
    data: Payload_Result
  ) {
    return payload.key_call === data.key_event_subscription[1];
  }

  private checkMatchedResult(
    payload: Payload_Function_Data,
    data: Payload_Result
  ) {
    return (
      this.checkGeneralResult(data) || this.checkSpecificResult(payload, data)
    );
  }

  private checkValidResult(
    payload: Payload_Function_Data,
    data: Payload_Result
  ) {
    return data.data !== undefined && this.checkMatchedResult(payload, data);
  }

  public cleanResults(payload: Payload_Function_Data, data: Payload_Result) {
    if (this.checkValidResult(payload, data)) {
      this.setResults(data);
    }
  }

  public extractDataFromResult(
    key_event: string,
    results: Map_Results,
    key_call?: string
  ): any {
    if (results[key_event]) {
      const result = results[key_event];

      if (!key_call || (result.key_call && result.key_call === key_call)) {
        // Use setTracedValue to remove the key_event from the state
        this.setResults({
          key_event_subscription: [key_event, ""],
          data: undefined,
        });

        return result;
      }
    }
  }

  public extractAssetURLFromList(assets: Asset[], key_asset: string) {
    const found_asset = assets.find((asset) => asset.key_asset === key_asset);

    return found_asset ? found_asset.url : key_asset;
  }

  private generateMounts(
    keys_function: string[],
    payload: Payload_Function_Data
  ): Payload_Function[] {
    keys_function.map((key_function: string) => {
      const func = this.getFunction(key_function);

      let payload_function_data: Payload_Function_Data = {
        handler_event: payload.handler_event,
        key_call: payload.key_call,
      };

      payload_function_data.updateResults = (data: Payload_Result) => {
        this.cleanResults(payload, data);
      };

      func(payload_function_data);
    });

    return [];
  }

  private generateUnmounts(
    keys_function: string[],
    payload: Payload_Function_Data
  ): Payload_Function[] {
    let functions: Payload_Function[] = [];
    keys_function.map((key_function: string) => {
      const func = this.getFunction(key_function);
      let payload_function_data: Payload_Function_Data = {
        handler_event: payload.handler_event,
        key_call: payload.key_call,
      };

      payload_function_data.updateResults = (data: Payload_Result) => {
        this.cleanResults(payload, data);
      };

      functions.push(func);
    });

    return functions;
  }

  private generateLifecycles(
    keys_function: string[]
  ): Payload_Lifecycle_Function[] {
    let functions: Payload_Lifecycle_Function[] = [];
    keys_function.map((key_function: string) => {
      const func = this.getFunction(key_function);
      functions.push({ key_function: key_function, function: func });
    });

    return functions;
  }

  public generateFunctions(
    key: Key_Function_Types,
    payload?: Payload_Function_Data
  ): Payload_Function[] | Payload_Lifecycle_Function[] {
    if (this.component_data.content.functions)
      switch (key) {
        case "mount":
          if (this.component_data.content.functions.mount && payload)
            return this.generateMounts(
              this.component_data.content.functions.mount,
              payload
            );
          break;
        case "unmount":
          if (this.component_data.content.functions.unmount && payload)
            return this.generateUnmounts(
              this.component_data.content.functions.unmount,
              payload
            );

          break;
        case "lifecycle":
          if (this.component_data.content.functions.lifecycle)
            return this.generateLifecycles(
              this.component_data.content.functions.lifecycle
            );
          break;
        default:
          this.notifyLog({
            status_code: 404,
            description: `Requested function ${this.component_data.key_component}, ${key} in ${this.component_data.key_component} not found.`,
          });
          break;
      }

    return [];
  }
}
