import React from "react";

export const Button = ({ children, className = "" }) => <button className={`rounded px-4 py-2 font-medium ${className}`}>{children}</button>;
