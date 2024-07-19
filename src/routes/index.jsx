import LayoutDefault from "~/layout/LayoutDefault/index.jsx";
import HomePage from "~/pages/HomePage/index.jsx";
import PrivateRoute from "~/components/PrivateRoute/index.jsx";
import ProfilePage from "~/pages/ProfilePage/index.jsx";


export const routes = [
  {
    path: "/",
    element: <LayoutDefault/>,
    children: [
      {
        path: "/",
        element: <HomePage/>
      },
      {
        element: <PrivateRoute/>,
        children: [
          {
            path: "/profile",
            element: <ProfilePage/>
          }
        ]
      }
    ]
  },
]