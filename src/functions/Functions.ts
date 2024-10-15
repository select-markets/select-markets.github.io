export type Map_Function = {
  [key: string]: any;
};

const map_function: Map_Function = {
  function: {
    common: {
      subscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.subscribe(
            "api_answer",
            (data: Payload_Answer) => {
              if (payload.updateResults)
                payload.updateResults({
                  key_event_subscription: ["api_answer"],
                  data: data.data,
                });
            }
          );
      },
      unsubscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.unsubscribe(
            "api_answer",
            (data: Payload_Answer) => {
              if (payload.updateResults)
                payload.updateResults({
                  key_event_subscription: ["api_answer"],
                  data: data.data,
                });
            }
          );
      },
      publish: {
        store: (payload: Payload_Function_Data) => {
          if (payload.handler_event && payload.data)
            payload.handler_event.publish("store_short_term", payload.data);
        },
      },
    },
    assets: {
      subscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.subscribe(
            "environment_answer",
            (data: Payload_Answer) => {
              if (payload.updateResults && payload.key_call === data.key_call) {
                payload.updateResults({
                  key_event_subscription: ["environment_answer", data.key_call],
                  data: data.data,
                });
              }
            }
          );
      },
      unsubscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.unsubscribe(
            "environment_answer",
            (data: Payload_Answer) => {
              if (payload.updateResults && payload.key_call === data.key_call)
                payload.updateResults({
                  key_event_subscription: ["environment_answer", data.key_call],
                  data: data.data,
                });
            }
          );
      },
    },
    environment: {
      subscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.subscribe(
            "environment_answer",
            (data: string) => {
              if (payload.updateResults)
                payload.updateResults({
                  key_event_subscription: [payload.key_call],
                  data: data,
                });
            }
          );
      },
      unsubscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.unsubscribe(
            "environment_answer",
            (data: string) => {
              if (payload.updateResults)
                payload.updateResults({
                  key_event_subscription: [payload.key_call],
                  data: data,
                });
            }
          );
      },
    },
    loader: {
      subscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event) {
          payload.handler_event.subscribe("load", (data: Payload_Answer) => {
            if (payload.updateResults)
              payload.updateResults({
                key_event_subscription: ["load"],
                data: data,
              });
          });
        }
      },
      unsubscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event) {
          payload.handler_event.unsubscribe("load", (data: Payload_Answer) => {
            if (payload.updateResults)
              payload.updateResults({
                key_event_subscription: ["load"],
                data: data,
              });
          });
        }
      },
    },
    navigation: {
      page: {
        subscribe: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.subscribe(
              "page_navigation",
              (data: string) => {
                if (payload.updateResults)
                  payload.updateResults({
                    key_event_subscription: ["page_navigation"],
                    data: data,
                  });

                payload.handler_event.publish("add_modal", {
                  data: {
                    key_modal: "close_all_modals",
                  },
                });
              }
            );
        },
        unsubscribe: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.unsubscribe(
              "page_navigation",
              (data: string) => {
                if (payload.updateResults)
                  payload.updateResults({
                    key_event_subscription: ["page_navigation"],
                    data: data,
                  });

                payload.handler_event.publish("add_modal", {
                  data: {
                    key_modal: "close_all_modals",
                  },
                });
              }
            );
        },
        publish_home: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.publish("page_navigation", "Home");
        },
        publish_contact: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.publish("page_navigation", "Contact");
        },
        publish_about: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.publish("page_navigation", "About");
        },
        publish_faq: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.publish("page_navigation", "FAQ");
        },
        publish_vendor: (payload: Payload_Function_Data) => {
          if (payload.handler_event)
            payload.handler_event.publish("page_navigation", "Vendor");
        },
      },
    },
    modal: {
      subscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.subscribe(
            "add_modal",
            (data: Payload_Answer) => {
              if (payload.updateResults)
                payload.updateResults({
                  key_event_subscription: ["add_modal"],
                  data: data.data,
                });
            }
          );
      },
      unsubscribe: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.unsubscribe("add_modal", (data: any) => {
            if (payload.updateResults)
              payload.updateResults({
                key_event_subscription: ["add_modal"],
                data: data.data,
              });
          });
      },
      add: (payload: Payload_Function_Data) => {
        if (payload.handler_event)
          payload.handler_event.publish("add_modal", payload.data);
      },
    },
  },
};

export default map_function;
