import React, { useEffect, useRef, useState } from "react";
import { Utility_Display_HTML } from "../utilities/Utility_Display_HTML";
import jsonEqual from "../helper/jsonEqual";
import "../assets/css/Modal.css";

const Component_Modal: React.FC<Props_Component_Modal> = ({
  payload_modal,
  closeModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Data_Position>({ x: 0, y: 0 });
  const [position, setPosition] = useState<Data_Position>({ x: 0, y: 0 });
  const [isCentered, setIsCentered] = useState<boolean>(false);

  const handleClose = () => closeModal(payload_modal.key_modal);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (modalRef.current && !isCentered) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const x = window.innerWidth / 2 - modalWidth / 2;
      const y = window.innerHeight / 2 - modalHeight / 2;
      setPosition({ x, y });
      setIsCentered(true);
    }
  }, [isCentered]);

  const headerStyle: React.CSSProperties = {
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      data-component="Component_Modal"
      ref={modalRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        data-component="Component_Modal_Header"
        onMouseDown={handleMouseDown}
        style={headerStyle}
      >
        <p>{payload_modal.modal.title}</p>
        <h1 onClick={handleClose}>&times;</h1>
      </div>
      <div data-component="Component_Modal_Content">
        <Utility_Display_HTML html={payload_modal.modal.content} />
      </div>
    </div>
  );
};

export const Component_Modal_Pseudo = ({
  data,
  results,
  onFinishLoad,
}: Props_Component_Rendered) => {
  const [mapModal, setMapModal] = useState<Map_Modal>({});
  const [lastResults, setLastResults] = useState<any>();

  const closeModal = (key: string) => {
    const newMap = { ...mapModal };
    delete newMap[key];
    setMapModal(newMap);
  };

  const addModal = (payload: Payload_Modal) => {
    const newMap = { ...mapModal, [payload.key_modal]: payload };
    setMapModal(newMap);
  };

  const setModals = (payload: Payload_Modal) => {
    if (payload.key_modal === "close_all_modals") setMapModal({});
    else addModal(payload);
  };

  const parseResults = () => {
    const result_modals: Payload_Result =
      data.handler_function.extractDataFromResult("add_modal", results);

    if (result_modals) setModals(result_modals.data);
    setLastResults(results);
  };

  useEffect(() => {
    onFinishLoad();
  }, []);

  useEffect(() => {
    if (!jsonEqual(results, lastResults)) parseResults();
  }, [results]);

  return (
    <div
      data-component="Component_Modal_Pseudo"
      data-css={data.json.content.key_css}
      onClick={() => data.handleLifecycle}
      data-key={data.key_call}
    >
      {Object.values(mapModal).map((payload_modal) => (
        <Component_Modal
          key={payload_modal.key_modal}
          payload_modal={payload_modal}
          closeModal={closeModal}
        />
      ))}
    </div>
  );
};
