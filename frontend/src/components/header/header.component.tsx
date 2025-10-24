import type {HeaderProps} from "./header.types.ts";
import {Nav} from "../nav/nav.component.tsx";
import "./header.style.css"

export function Header({navItems}: HeaderProps) {
  return (
    <header className={"header-component"}>
      <div className={"container"}>
        <Nav items={navItems}/>
      </div>
    </header>
  );
}
