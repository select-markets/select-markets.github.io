import { useEffect } from "react";

export const Component_Template = ({
  data,
  results,
  onFinishLoad,
  notifyLog,
}: Props_Component_Rendered) => {
  /*   
  const [lastResults, setLastResults] = useState<any>();

  const parseResults = () => {
    setLastResults(results);
  }
  
  useEffect(() => {
    // this check must be done on the component level rather than the generic wrapper level
    // because the generic wrapper level takes in multiple async messages and turns it into a linear stream of messages that happen one after another
    // check makes sure that messages updating the state of the component dont happen more than once in a row
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]); */

  // loader - put final condition in dependancy
  useEffect(() => {
    onFinishLoad();
  }, []);

  return (
    <div
      data-component="Component_Template"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle}
      data-key={data.key_call}
    >
      Component_Template
    </div>
  );
};
