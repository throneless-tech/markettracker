import React, { ReactNode } from "react";

import { Tooltip } from "@chakra-ui/react";
// import "./index.scss";

const baseClass = "field-error";

type Props = {
  alignCaret?: "center" | "left" | "right";
  children?: ReactNode;
  message: string;
  showError?: boolean;
};

export const ErrorTooltip: React.FC<Props> = (props) => {
  const { alignCaret = "right", children, message, showError = false } = props;

  if (showError) {
    return (
      <Tooltip
        placement={alignCaret === "center" ? "bottom" : alignCaret}
        defaultIsOpen
        className={baseClass}
        openDelay={0}
        label={message}
      >
        {children}
      </Tooltip>
    );
  }

  return children;
};
