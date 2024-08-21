import PrivateRoute from "~/components/PrivateRoute/index.jsx";
import {Navigate} from "react-router-dom";
import Page404 from "~/pages/404/index.jsx";
import ErrorBoundary from "~/components/ErrorBoundary/index.jsx";
import IndexPage from "~/pages/index.jsx";
import PracticePage from "~/pages/PracticePage/index.jsx";
import HomePage from "~/pages/HomePage/index.jsx";

export const routes = [
  {
    path: "/homepage",
    element: <HomePage/>
  },
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
            element: <Navigate to="/practice"/>
          },
          {
            path: "/practice",
            element: <PracticePage/>
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