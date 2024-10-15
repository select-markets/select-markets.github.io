import { ReactNode } from "react";

interface Props_Utility_Hover {
  setHovered: (state: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const Utility_Hover = ({
  setHovered,
  children,
  className,
}: Props_Utility_Hover) => {
  return (
    <div
      data-component="Utility_Hover"
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};
