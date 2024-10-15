import {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Handler_Event from "../handler/Handler_Event";
import Handler_Function from "../handler/Handler_Function";
import generateUniqueHash from "../helper/generateUniqueHash";
import { Component_Banner } from "./Component_Banner";
import { Component_Button } from "./Component_Button";
import { Component_Container } from "./Component_Container";
import { Component_Page_Title } from "./Component_Page_Title";
import { Component_Text } from "./Component_Text";
import { Component_Page } from "./Component_Page";
import { Component_App_Router } from "./Component_App_Router";
import { Component_Modal_Pseudo } from "./Component_Modal_Pseudo";
import { Component_Loader } from "./Component_Loader";
import { Component_Header } from "./Component_Header";
import { Component_Button_Logo } from "./Component_Button_Logo";
import { Component_Hero } from "./Component_Hero";

const Component_Map: Record<
  string,
  FunctionComponent<Props_Component_Rendered>
> = {
  app_router: Component_App_Router, // background component for navigation
  banner: Component_Banner, // like a container with a background color
  button: Component_Button, // button that can render html inside of it
  button_logo: Component_Button_Logo,
  container: Component_Container, // generic container that can be manipulated via css that can hold other components
  header: Component_Header,
  hero: Component_Hero,
  loader: Component_Loader, // background component to hold loading logic
  modal_pseudo: Component_Modal_Pseudo, // component used to render modals that can hold other components
  page: Component_Page, // component for a page that can hold other components
  page_title: Component_Page_Title, // basically just an <h1>, can render html
  text: Component_Text, // generic text component , can render html
};

const Component_Generic = ({ data }: Props_Component_Generic) => {
  if (!data.enabled) return;

  const Component_Rendered = Component_Map[data.key_component];
  const key_call = useRef<string>(
    `${data.key_component}_${generateUniqueHash()}`
  ).current;
  const handler_event = Handler_Event.getInstance();
  // State and Refs for managing updates
  const resultsRef = useRef<Map_Results>({});
  const [results, setResults] = useState<Map_Results>({});
  const updateQueue = useRef<Array<Payload_Result>>([]);
  const processingUpdate = useRef<boolean>(false);
  const [componentData, setComponentData] = useState<Data_Component_Rendered>();
  const [cleanUpFunctions, setCleanUpFunctions] = useState<Payload_Function[]>(
    []
  );

  const notifyLog = (log: Payload_Log) => {
    handler_event.publish("log", log);
  };

  // Function to queue updates
  const queueUpdate = useCallback((result: Payload_Result) => {
    updateQueue.current.push(result);
    if (!processingUpdate.current) {
      processNextUpdate();
    }
  }, []);
  const handler_function = new Handler_Function(
    handler_event,
    data,
    queueUpdate
  );

  // Function to process updates sequentially
  const processNextUpdate = useCallback(() => {
    if (updateQueue.current.length > 0) {
      processingUpdate.current = true;
      const result = updateQueue.current.shift();

      if (result) {
        const [key_event, result_key_call] = result.key_event_subscription;

        notifyLog({
          status_code: 0,
          description: `[${key_call}] Processing action: ${JSON.stringify(
            result
          )}`,
        });

        setResults((prevResults) => {
          const newResults = { ...prevResults };

          if (result.data === undefined) {
            // Create a new state object without the key_event
            const { [key_event]: _, ...newState } = newResults;
            resultsRef.current = newState;

            notifyLog({
              status_code: 0,
              description: `[${key_call}] State after removing key_event: ${JSON.stringify(
                newState
              )}`,
            });

            return newState;
          }

          newResults[key_event] = { key_call: key_call, data: result.data };
          resultsRef.current = newResults;

          notifyLog({
            status_code: 0,
            description: `[${key_call}] State after update: ${JSON.stringify(
              newResults
            )}`,
          });

          return newResults;
        });

        // Call the next update after processing this one
        setTimeout(() => {
          processingUpdate.current = false;
          processNextUpdate();
        }, 0); // Use a timeout of 0 to yield to the event loop
      }
    }
  }, [key_call]);

  function onFinishLoad() {
    if (data.loadable)
      handler_event.publish("load", {
        key_call: key_call,
        finished: true,
      });
  }

  const initializeComponent = async () => {
    if (data.loadable)
      handler_event.publish("load", {
        key_call: key_call,
        finished: false,
      });

    handler_function.generateFunctions("mount", {
      handler_event: handler_event,
      key_call: key_call,
    });

    setCleanUpFunctions(
      handler_function.generateFunctions("unmount", {
        handler_event: handler_event,
        key_call: key_call,
      }) as Payload_Function[]
    );

    setComponentData({
      key_call: key_call,
      json: data,
      handler_event: handler_event,
      handler_function: handler_function,
      handleLifecycle: (data: Payload_Lifecycle_Function_Input) => {
        handler_function.generateFunctions("lifecycle").forEach((func) => {
          const func_lifecycle: Payload_Lifecycle_Function =
            func as Payload_Lifecycle_Function;

          if (
            !data.key_function ||
            func_lifecycle.key_function === data.key_function
          )
            func_lifecycle.function({
              handler_event: handler_event,
              key_call: key_call,
              data: data.input,
            });
        });
      },
    });
  };

  const cleanUp = () => {
    cleanUpFunctions.forEach((func: Payload_Function) => func());
  };

  useEffect(() => {
    initializeComponent();

    return () => {
      cleanUp();
    };
  }, []);

  if (componentData)
    return (
      <Component_Rendered
        data={componentData}
        results={results}
        onFinishLoad={onFinishLoad}
        notifyLog={notifyLog}
      />
    );

  return null;
};

export default Component_Generic;
