interface Payload_Coordinate {
  x: number;
  y: number;
}

interface Payload_Trail {
  coordinate: Payload_Coordinate;
  id: string;
  index: number;
}

interface Map_Modal {
  [key: string]: Payload_Modal;
}

interface Payload_Modal {
  key_modal: string;
  modal: Data_Modal;
}

interface Data_Modal {
  title: string;
  content: string;
}

interface Props_Component_Modal {
  payload_modal: Payload_Modal;
  closeModal: (key: string) => void;
}

interface Data_Position {
  x: number;
  y: number;
}

interface Props_Component_Generic {
  data: Data_Component_Generic;
}

interface Asset {
  key_asset: string;
  url?: string;
}

interface Data_Component_Rendered {
  key_call: string;
  json: Data_Component_Generic;
  handler_event: Handler_Event;
  handler_function: Handler_Function;
  handleLifecycle: (data: Payload_Lifecycle_Function_Input) => void;
}

interface Props_Component_Rendered {
  data: Data_Component_Rendered;
  results: Map_Results;
  onFinishLoad: () => void;
  notifyLog: (log: Payload_Log) => void;
}

interface Data_Component_Generic {
  key_component: string;
  type: "infrastructure" | "architecture";
  enabled: boolean;
  loadable: boolean;
  content: {
    key_css?: string;
    key_page?: string;
    functions?: {
      mount?: string[];
      unmount?: string[];
      lifecycle?: string[];
    };
    children?: Data_Component_Generic[];
    text?: string;
    assets?: Asset[];
  };
}

interface Payload_Lifecycle_Function_Input {
  key_function?: string;
  input: any;
}

interface Payload_API_Answer {
  Data: any;
  Status: {
    Code: number;
    Message: string;
  };
}

interface Payload_API_Call {
  key_api: Key_API_Types;
  key_call: string;
  data: any;
}

interface Payload_Environment {
  path: string[];
  key_environment?: string | string[];
}

interface Payload_Environment_Sanitized extends Payload_Environment {
  fallback: any;
}

interface Payload_Environment_Call extends Payload_Environment_Sanitized {
  key_call: string;
}

interface Payload_Log {
  status_code: number;
  description: string;
  timestamp?: string;
  context?: string;
}

type Payload_Function = (payload?: Payload_Function_Data) => any;

type Payload_Lifecycle_Function = {
  key_function: string;
  function: Payload_Function;
};

interface Payload_Result {
  key_event_subscription: [Key_Events, string | undefined];
  data: any;
}

interface Map_Results {
  [key_event: string]: { key_call: string | undefined; data: any };
}

interface Payload_Function_Data {
  handler_event: Handler_Event;
  key_call: string;
  data?: any;
  updateResults?: (data: any) => void;
}

interface Payload_Answer {
  key_call: string;
  data: any;
}

interface Action<T> {
  type: string;
  payload: T;
}

interface Context_Brain_Value {
  handler_event: Handler_Event;
  handler_log: Handler_Log;
  handler_environment?: Handler_Environment;
  handler_api: Handler_API;
}

interface Payload_Store {
  key_store: string;
  data: any;
}

interface Payload_Retrieve {
  key_retrieve: string;
  key_call?: string;
}

interface Result_Retrieve {
  key_retrieve: string;
  result: any;
}

interface State {
  [key: string]: any;
}

interface Payload_Theme {
  ThemeID: number;
  ThemeName: string;
}

type Map_Event = {
  [key in Key_Events]: { callbacks: Function[]; data?: any };
};

type Key_Events =
  | "log"
  | "store_short_term"
  | "store_long_term"
  | "retrieve_call"
  | "retrieve_answer"
  | "page_navigation"
  | "environment_call"
  | "environment_answer"
  | "preferences_update"
  | "button_toggle"
  | "api_call"
  | "api_answer"
  | "add_modal"
  | "load";
