import type {HeaderProps} from "./header.types.ts";
import {useAuth} from "../../providers/auth/auth.context.tsx";
import {Nav} from "../nav/nav.component.tsx";
import "./header.style.css"
import {Button} from "../button/button.component.tsx";

export function Header({navItems}: HeaderProps) {
  const {user, login, logout} = useAuth();

  return (
    <header className={"header-component"}>
      <div className={"header-component-container container"}>
        <Nav className={"header-component-item"} items={navItems}/>
        <div className={"header-component-item"}>
          {user ? (
            <>
              <span style={{"marginRight": "12px"}}>Hello, {user.name}</span>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button onClick={() => login("User")}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
