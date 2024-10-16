import { useEffect, useState } from "react";

export const Component_Loader = ({
  data,
  results,
  onFinishLoad,
  notifyLog,
}: Props_Component_Rendered) => {
  const [currentlyLoading, setCurrentlyLoading] = useState<Set<string>>(
    new Set<string>()
  );

  function setToString<T>(inputSet: Set<T>): string {
    return Array.from(inputSet).join(", ");
  }

  const parseLoadResults = (result_load: Payload_Result) => {
    const { key_call, finished } = result_load.data;

    setCurrentlyLoading((prevLoading) => {
      const newLoading = new Set(prevLoading); // Create a new Set from the previous state

      if (newLoading.has(key_call)) {
        newLoading.delete(key_call);
        notifyLog({
          status_code: 0,
          description: "Done Loading:" + key_call,
        });
      } else if (!finished) newLoading.add(key_call);

      return newLoading;
    });
  };

  const parseResults = () => {
    const result_load: Payload_Result =
      data.handler_function.extractDataFromResult("load", results);

    if (result_load) parseLoadResults(result_load);
  };

  useEffect(() => {
    console.log(currentlyLoading);

    if (currentlyLoading.size > 0) {
      document.body.style.cursor = "wait";

      notifyLog({
        status_code: 0,
        description: "Currently Loading: " + setToString(currentlyLoading),
      });
    }

    return () => {
      document.body.style.cursor = "default";
    };
  }, [currentlyLoading]);

  useEffect(() => {
    parseResults();
  }, [results]);

  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <div
      data-component="Component_Loader"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle}
      data-key={data.key_call}
    />
  );
};
