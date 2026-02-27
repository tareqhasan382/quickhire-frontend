import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => {
  // max-w-[1192px]
  return (
    <div className={`mx-auto w-full  ${className}`}>
      {children}
    </div>
  );
};

export default Container;
