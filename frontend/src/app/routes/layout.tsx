import {Outlet} from 'react-router-dom';
import {Header} from "../../components/header/header.component.tsx";
import {Footer} from "../../components/footer/footer.component.tsx";

const headerNavItems = [
  {label: 'Home', to: '/'},
  {label: 'Tasks', to: '/tasks'},
];

export function Layout() {
  return (
    <>
      <div>
        <Header navItems={headerNavItems}/>
        <main>
          <Outlet/>
        </main>
      </div>
      <Footer/>
    </>
  )
}
