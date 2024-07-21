import LayoutDefault from "~/layout/LayoutDefault/index.jsx";
import PrivateRoute from "~/components/PrivateRoute/index.jsx";
import ProfilePage from "~/pages/ProfilePage/index.jsx";
import {Navigate} from "react-router-dom";
import Page404 from "~/pages/404/index.jsx";
import ErrorBoundary from "~/components/ErrorBoundary/index.jsx";
import HomePage from "~/pages/HomePage/index.jsx";
import IndexPage from "~/pages/index.jsx";
import UserHomePage from "~/pages/UserHomePage/index.jsx";

export const routes = [
  {
    path: "/",
    element: <ErrorBoundary><IndexPage/></ErrorBoundary>,
    children: [
      {
        path: "/",
        element: <PrivateRoute/>,
        children: [
          {
            path: "/",
            element: <UserHomePage/>
          }
        ]
      }
    ]
  },
  {
    path: "/404",
    element: <Page404/>
  },
  {
    path: "*",
    element: <Navigate to="/404" state={{
      messageToast: {
        type: "error",
        message: "Trang không tồn tại"
      },
    }}/>
  }
]