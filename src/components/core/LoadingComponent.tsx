import React from "react";

type LoadingIndicatorProps = {
  size?: "sm" | "md" | "lg" | number;
  placement?: "fullscreen" | "inline";
  color?: string;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = "md",
  placement = "inline",
  color = "#3b82f6",
}) => {
  const dimension =
    typeof size === "number"
      ? `${size}px`
      : size === "sm"
        ? "24px"
        : size === "md"
          ? "48px"
          : "72px";

  const spinner = (
    <div
      style={{
        width: dimension,
        height: dimension,
        border: `${parseInt(dimension) / 8}px solid #f3f3f3`,
        borderTop: `${parseInt(dimension) / 8}px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );

  if (placement === "fullscreen") {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
        {spinner}
      </div>
    );
  }

  // inline
  return <div className="flex items-center justify-center">{spinner}</div>;
};

export default LoadingIndicator;
