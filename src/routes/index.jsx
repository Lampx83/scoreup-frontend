import PrivateRoute from "~/components/PrivateRoute/index.jsx";
import {Navigate} from "react-router-dom";
import Page404 from "~/pages/404/index.jsx";
import IndexPage from "~/pages/index.jsx";
import PracticePage from "~/pages/PracticePage/index.jsx";
import HomePage from "~/pages/HomePage/index.jsx";
import ProfilePage from "~/pages/ProfilePage/index.jsx";
import RecommendPage from "~/pages/RecommendPage/index.jsx";
import DashboardPage from "~/pages/DashboardPage/index.jsx";
import HistoryPage from "~/pages/HistoryPage/index.jsx";
import ResultPage from "~/pages/ResultPage/index.jsx";
import LayoutLecturer from "~/layout/LayoutLecturer/index.jsx";
import LecturerLoginPage from "~/pages/LecturerPages/LoginPage/index.jsx";
import LecturerHomePage from "~/pages/LecturerPages/HomePage/index.jsx";
import LecturerDetailTestPage from "~/pages/LecturerPages/DetailTestPage/index.jsx";
import StatisticPage from "~/pages/StatisticPage/index.jsx";

export const routes = [
  {
    path: "/homepage",
    element: <HomePage/>
  },
  {
    path: "/",
    // element: <ErrorBoundary><IndexPage/></ErrorBoundary>,
    element: <IndexPage/>,
    children: [
      {
        path: "/",
        element: <PrivateRoute/>,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard"/>
          },
          {
            path: "/practice",
            element: <PracticePage/>
          },
          {
            path: "/profile",
            element: <ProfilePage/>
          },
          {
            path: "/recommend",
            element: <RecommendPage/>
          },
          {
            path: "/dashboard",
            element: <DashboardPage/>
          },
          {
            path: "/history/:id",
            element: <HistoryPage/>
          },
          {
            path: "/history/:certId/:resultId",
            element: <ResultPage/>
          }
        ]
      }
    ]
  },
  {
    path: "/lecturer/login",
    element: <LecturerLoginPage/>
  },
  {
    path: "/lecturer",
    element: <LayoutLecturer/>,
    children: [
      {
        path: "/lecturer",
        element: <LecturerHomePage/>
      },
      {
        path: "/lecturer/test/:id",
        element: <LecturerDetailTestPage/>
      },
      {
        path: "/lecturer/statistic",
        element: <StatisticPage/>
      },
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