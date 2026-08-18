import React from "react";
import { Navigate } from "react-router-dom";

export const NewInterview: React.FC = () => {
  return <Navigate to="/custom-interview" replace />;
};
