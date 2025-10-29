import type {ComponentPropsWithoutRef} from "react";

export type NavProps = ComponentPropsWithoutRef<"nav"> & {
  items: NavItem[];
}

export type NavItem = {
  label: string;
  to: string;
}
