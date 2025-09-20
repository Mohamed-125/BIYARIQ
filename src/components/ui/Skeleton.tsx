import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  style,
  ...props
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-400/70  rounded-md ${className}`.trim()}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
