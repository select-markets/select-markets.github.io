import { ReactNode } from "react";

interface Props_Utility_Hover {
  setHovered: (state: boolean) => void;
  children: ReactNode;
}

export const Utility_Hover = ({
  setHovered,
  children,
}: Props_Utility_Hover) => {
  return (
    <div
      data-component="Utility_Hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};
