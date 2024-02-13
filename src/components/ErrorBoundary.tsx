import React, { FC } from "react";

export const ErrorPage: FC<any> = ({ error, resetErrorBoundary }) => {
  const { statusCode } = error;
  return <div>{statusCode}</div>;
};
