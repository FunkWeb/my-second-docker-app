import type {NavProps} from "./nav.types.ts";
import {Link} from "react-router-dom";
import './nav.style.css'

export function Nav({items}: NavProps) {
  return (
    <nav className={"nav-component"}>
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
