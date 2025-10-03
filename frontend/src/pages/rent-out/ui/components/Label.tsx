import React from "react";
import { cls } from "../helpers/cls";

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
  children,
  className,
  ...props
}) => (
  <label
    {...props}
    className={cls("block text-sm font-medium text-neutral-700", className)}
  >
    {children}
  </label>
);

export default Label;
