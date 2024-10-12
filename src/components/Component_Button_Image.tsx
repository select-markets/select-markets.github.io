import { useEffect, useState } from "react";
import jsonEqual from "../helper/jsonEqual";
import { Component_Display_HTML } from "./Component_Display_HTML";
import convertToSnakeCase from "../helper/convertToSnakeCase";

export const Component_Button_Image = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [preferences, setPreferences] = useState<Data_Preferences>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [toggled, setToggled] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<Map_Translations>();
  const [lastResults, setLastResults] = useState<any>();

  const handleClick = () => {
    data.handleLifecycle({ input: data.json });
    setToggled(!toggled);
  };

  const checkUpdatedPreferences = (result_preferences: Payload_Result) => {
    return (
      result_preferences &&
      !jsonEqual(result_preferences.data.result, preferences)
    );
  };

  const parsePreferencesResult = (result_preferences: Payload_Result) => {
    if (
      result_preferences.data.key_retrieve === "preferences" &&
      checkUpdatedPreferences(result_preferences)
    ) {
      setPreferences(result_preferences.data.result);
    }
  };

  const parseAssetsResults = (result_assets: Payload_Result) =>
    setAssets(result_assets.data);

  const parseToggleResults = (result_toggle: Payload_Result) =>
    setToggled(result_toggle.data);

  const gatherAssets = () => {
    if (preferences) {
      let key_array: string[] = [];

      data.json.content.assets.forEach((asset: Asset) =>
        key_array.push(asset.key_asset)
      );

      data.handler_event.publish("environment_call", {
        key_call: data.key_call,
        fallback: [],
        path: [
          "subscriber_content",
          "assets",
          convertToSnakeCase(preferences.ThemeName),
        ],
        key_environment: key_array,
      });
    }
  };

  const parseAPIResults = (result_api: Payload_Result) => {
    switch (result_api.data.key_api) {
      case "get_translations":
        if (data.json.content.translations)
          setTranslatedText(result_api.data.data);
        break;
      default:
        break;
    }
  };

  const parseResults = () => {
    const result_preferences: Payload_Result =
      data.handler_function.extractDataFromResult(
        "retrieve_answer",
        results,
        data.key_call
      );

    if (result_preferences) parsePreferencesResult(result_preferences);

    const result_assets: Payload_Result =
      data.handler_function.extractDataFromResult(
        "environment_answer",
        results,
        data.key_call
      );

    if (result_assets) parseAssetsResults(result_assets);

    const result_toggle: Payload_Result =
      data.handler_function.extractDataFromResult(
        "button_toggle",
        results,
        data.key_call
      );

    if (result_toggle) parseToggleResults(result_toggle);

    const result_api: Payload_Result =
      data.handler_function.extractDataFromResult("api_answer", results);

    if (result_api) parseAPIResults(result_api);
    setLastResults(results);
  };

  useEffect(() => {
    if (assets) onFinishLoad();
  }, [assets]);

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  useEffect(() => {
    gatherAssets();
  }, [preferences]);

  return (
    assets.length > 0 && (
      <button
        data-component={
          data.json.content.hover
            ? "Component_Button_Image_Hover"
            : "Component_Button_Image"
        }
        data-css={data.json.content.key_css}
        className={toggled ? "toggled" : ""}
        onClick={handleClick}
        data-key={data.key_call}
      >
        <img src={assets[0].url} />
        {translatedText && (
          <Component_Display_HTML html={translatedText.text_button} />
        )}
      </button>
    )
  );
};
