import {Outlet} from 'react-router-dom';
import {Header} from "../../components/header/header.component.tsx";
import {Footer} from "../../components/footer/footer.component.tsx";

const navItems = [
  {label: 'Home', to: '/'},
  {label: 'Tasks', to: '/tasks'},
];

export function Layout() {
  return (
    <>
      <div>
        <Header navItems={navItems}/>
        <main>
          <Outlet/>
        </main>
      </div>
      <Footer/>
    </>
  )
}
