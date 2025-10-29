import type {NavProps} from "./nav.types.ts";
import {Link} from "react-router-dom";
import './nav.style.css'

export function Nav({items, className, ...props}: NavProps) {
  return (
    <nav className={["nav-component", className].filter(Boolean).join(" ")} {...props}>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
