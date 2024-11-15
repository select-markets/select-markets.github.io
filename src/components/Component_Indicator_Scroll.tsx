import "../assets/css/Indicator_Scroll.css";

interface Props_Component_Indicator_Scroll {
  visible: boolean;
}

export const Component_Indicator_Scroll = ({
  visible,
}: Props_Component_Indicator_Scroll) => {
  return (
    <div
      data-component="Component_Indicator_Scroll"
      className={`${visible} pop-in : pop-out`}
    >
      Scroll
      <svg
        className="down-arrow"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 16L6 10h12L12 16z" fill="currentColor" />
      </svg>
    </div>
  );
};
