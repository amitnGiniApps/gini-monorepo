import React from "react";

export const Card = ({ children, className = "" }) => <div className={`rounded-2xl shadow p-4 bg-white ${className}`}>{children}</div>;
export const CardHeader = ({ children }) => <div className="mb-2">{children}</div>;
export const CardTitle = ({ children }) => <h3 className="text-xl font-semibold">{children}</h3>;
export const CardContent = ({ children }) => <div>{children}</div>;
