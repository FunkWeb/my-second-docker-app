import React, {Suspense} from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Layout} from './layout.tsx';

const Home = React.lazy(() => import('./home/home.route.tsx'));
const Tasks = React.lazy(() => import('./tasks/tasks.route.tsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {index: true, element: <Home/>},
      {path: 'tasks', element: <Tasks/>},
      {path: '*', element: <div>Not found</div>},
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense>
      <RouterProvider router={router}/>
    </Suspense>
  );
}
