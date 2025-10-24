import {type ButtonHTMLAttributes, type PropsWithChildren} from "react";
import "./button.style.css";

export type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({children, ...props}: ButtonProps) {
  return (
    <button className="button-component" {...props}>
      {children}
    </button>
  );
}
