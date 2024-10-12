import {
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Handler_Event from "../handler/Handler_Event";
import Handler_Environment from "../handler/Handler_Environment";
import Handler_Log from "../handler/Handler_Log";
import Handler_API from "../handler/Handler_API";
import Component_Generic from "../components/Component_Generic";

const Brain = createContext<Context_Brain_Value>({} as Context_Brain_Value);

export const Context_Brain = (): ReactElement | null => {
  const handler_event = useRef(Handler_Event.getInstance()).current;
  const handler_log = useRef(Handler_Log.getInstance(handler_event)).current;
  const handler_environment_instance = useRef(
    Handler_Environment.getInstance(handler_event)
  ).current;
  const handler_api = useRef(Handler_API.getInstance(handler_event)).current;

  const handler_environment = useRef(
    Handler_Environment.getInstance(handler_event)
  ).current;
  const [ready, setReady] = useState<boolean>(false);
  const [states, setStates] = useState<State>({});
  const stateRef = useRef<State>(states);
  const [appData, setAppData] = useState<Data_Component_Generic>(
    {} as Data_Component_Generic
  );

  // Map to store pending retrieve calls
  const pendingRetrieveCalls = useRef<Map<string, Array<Payload_Retrieve>>>(
    new Map()
  );

  const findDifference = (oldStates: State, newStates: State) => {
    const diff: State = {};
    Object.keys(newStates).forEach((key) => {
      if (oldStates[key] !== newStates[key]) diff[key] = newStates[key];
    });
    return diff;
  };

  useEffect(() => {
    const newStates = findDifference(stateRef.current, states);

    Object.keys(newStates).forEach((key) => {
      checkPendingRetrieves(key, newStates[key]);
    });

    stateRef.current = states;
  }, [states]);

  const storeShortTerm = (payload: Payload_Store) => {
    setStates((prevState) => {
      const newState = {
        ...prevState,
        [payload.key_store]: payload.data,
      };
      return newState;
    });
  };

  const storeLongTerm = (payload: Payload_Store) => {
    localStorage.setItem(payload.key_store, JSON.stringify(payload.data));
    checkPendingRetrieves(payload.key_store, payload.data);
  };

  const publishRetrieveData = (payload: Payload_Retrieve, data: any) => {
    handler_event.publish("retrieve_answer", {
      key_call: payload.key_call,
      data: {
        key_retrieve: payload.key_retrieve,
        result: data,
      },
    });
  };

  const checkPendingRetrieves = (key: string, data: any) => {
    if (pendingRetrieveCalls.current.has(key)) {
      const pendingCalls = pendingRetrieveCalls.current.get(key) || [];
      pendingCalls.forEach((pending_payload: Payload_Retrieve) => {
        publishRetrieveData(pending_payload, data);
      });
      pendingRetrieveCalls.current.delete(key);
    }
  };

  const retrieveData = (payload: Payload_Retrieve) => {
    if (payload.key_call === undefined) return;
    let returnData;

    const stateData = stateRef.current[payload.key_retrieve];
    if (stateData !== undefined) {
      returnData = stateData;
    } else {
      const storedData = localStorage.getItem(payload.key_retrieve);
      returnData = storedData ? JSON.parse(storedData) : undefined;
    }

    if (returnData === undefined) {
      const pendingCalls =
        pendingRetrieveCalls.current.get(payload.key_retrieve) || [];
      pendingCalls.push(payload);
      pendingRetrieveCalls.current.set(payload.key_retrieve, pendingCalls);
    } else {
      publishRetrieveData(payload, returnData);
    }

    if (payload.key_call === undefined) return returnData;
  };

  const initializeEnvironment = async () => {
    await Handler_Environment.initialize("configuration/Environment.json");
  };

  const initializeApp = (handler: Handler_Environment) => {
    const data_app = handler.sanitizedObjectLookUp({
      fallback: [],
      path: ["subscriber_content", "app"],
    });

    setAppData(data_app);
  };

  const initializeAPI = async (handler: Handler_Environment) =>
    await Handler_API.initialize();

  const initializeStorage = () => {
    handler_event.subscribe("store_short_term", (payload: Payload_Store) => {
      storeShortTerm(payload);
    });
    handler_event.subscribe("store_long_term", (payload: Payload_Store) => {
      storeLongTerm(payload);
    });
  };

  const initializeRetrieve = () => {
    handler_event.subscribe("retrieve_call", (payload: Payload_Retrieve) => {
      retrieveData(payload);
    });
  };

  const cleanUp = () => {
    handler_event.unsubscribe("store_short_term", (payload: Payload_Store) => {
      storeShortTerm(payload);
    });
    handler_event.unsubscribe("store_long_term", (payload: Payload_Store) => {
      storeLongTerm(payload);
    });
    handler_event.unsubscribe("retrieve_call", (payload: Payload_Retrieve) => {
      retrieveData(payload);
    });
  };

  const initializeContext = async () => {
    await initializeEnvironment();
    await initializeAPI(handler_environment_instance); // Ensure this is awaited
    initializeApp(handler_environment_instance);
    initializeStorage();
    initializeRetrieve();
    setReady(true);
  };

  useEffect(() => {
    initializeContext();

    return () => {
      cleanUp();
    };
  }, []);

  const contextValue: Context_Brain_Value = {
    handler_event,
    handler_log,
    handler_environment,
    handler_api,
  };

  return ready ? (
    <Brain.Provider value={contextValue}>
      <link
        rel="stylesheet"
        type="text/css"
        href="configuration/Environment.css"
      />
      <Component_Generic data={appData} />
    </Brain.Provider>
  ) : null;
};

export const useBrain = () => useContext(Brain);
