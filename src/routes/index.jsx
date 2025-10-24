import PrivateRoute from "~/components/PrivateRoute/index.jsx";
import { Navigate } from "react-router-dom";
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
import StatisticDetailPage from "~/pages/StatisticDetailPage/index.jsx";
import ForgotPassPage from "~/pages/ForgotPassPage/index.jsx";
import LayoutAuth from "~/layout/LayoutAuth/index.jsx";
import VerifyCodeForgotPage from "~/pages/VerifyCodeForgotPage/index.jsx";
import ResetPasswordPage from "~/pages/ResetPasswordPage/index.jsx";
import PostTestPage from "~/pages/PostTestPage/index.jsx";
import ListPostTestPage from "~/pages/ListPostTestPage/index.jsx";
import RankingPage from "~/pages/RankingPage/index.jsx";
import RecommendDetailList from "~/pages/RecommendDetailList/index.jsx";
import MicrosoftCallbackPage from "~/pages/MicrosoftCallbackPage/index.jsx";
import ListPostExamPage from "~/pages/ListPostExamPage";
import PostExamPage from "~/pages/PostExamPage";
import DetailExam from "~/pages/DetailExam";
import CreateExam from "~/pages/CreateExam";
import EditExam from "~/pages/EditExam";
import ResultUserExamPage from "~/pages/ResultUserExamPage";
import ResultAdminExamPage from "~/pages/ResultAdminExamPage";

export const routes = [
  {
    path: "/homepage",
    element: <HomePage />,
  },
  {
    path: "/auth",
    element: <LayoutAuth />,
    children: [
      {
        path: "/auth/forgot-password",
        element: <ForgotPassPage />,
      },
      {
        path: "/auth/forgot-password/verify-code",
        element: <VerifyCodeForgotPage />,
      },
      {
        path: "/auth/forgot-password/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/api/auth/callback/azure-ad",
    element: <MicrosoftCallbackPage />,
  },
  {
    path: "/",
    // element: <ErrorBoundary><IndexPage/></ErrorBoundary>,
    element: <IndexPage />,
    children: [
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" />,
          },
          {
            path: "/practice",
            element: <PracticePage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/recommend",
            element: <RecommendPage />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/history/:id",
            element: <HistoryPage />,
          },
          {
            path: "/history/:certId/:resultId",
            element: <ResultPage />,
          },
          {
            path: "/admin/history/:examId",
            element: <ResultAdminExamPage />,
          },
          {
            path: "/user/history/:examId",
            element: <ResultUserExamPage />,
          },
          {
            path: "/pre-test",
            element: <ListPostTestPage />,
          },
          {
            path: "/pre-test/:notionDatabaseId",
            element: <PostTestPage />,
          },
          {
            path: "/exam/:exam_id",
            element: <DetailExam />,
          },
          {
            path: "/exam",
            element: <ListPostExamPage />,
          },
          {
            path: "/do-exam/exam/:notionDatabaseId",
            element: <PostExamPage />,
          },
          {
            path: "/create-exam",
            element: <CreateExam />,
          },
          {
            path: "/edit-exam/:exam_id",
            element: <EditExam />,
          },
          // {
          //   path: "/detail-exam",
          //   element: <DetailExam />,
          // },
          {
            path: "/ranking",
            element: <RankingPage />,
          },
          {
            path: "/detail-recommend",
            element: <RecommendDetailList />,
          },
          {
            path: "/detail-exam/:exam_id",
            element: <DetailExam />,
          },
        ],
      },
    ],
  },
  {
    path: "/lecturer/login",
    element: <LecturerLoginPage />,
  },
  {
    path: "/lecturer",
    element: <LayoutLecturer />,
    children: [
      {
        path: "/lecturer",
        element: <LecturerHomePage />,
      },
      {
        path: "/lecturer/test/:id",
        element: <LecturerDetailTestPage />,
      },
      {
        path: "/lecturer/statistic",
        element: <StatisticPage />,
      },
      {
        path: "/lecturer/statistic/:id",
        element: <StatisticDetailPage />,
      },
    ],
  },

  {
    path: "/404",
    element: <Page404 />,
  },
  {
    path: "*",
    element: (
      <Navigate
        to="/404"
        state={{
          messageToast: {
            type: "error",
            message: "Trang không tồn tại",
          },
        }}
      />
    ),
  },
];
