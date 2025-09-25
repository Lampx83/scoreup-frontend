import useAuth from "~/hooks/useAuth.jsx";
import { Navigate, Outlet } from "react-router-dom";

function PrivateExamRoutes() {
  const auth = useAuth();

  if (!auth.isAuthenticated()) {
    return (
      <Navigate
        to="/auth/login"
        state={{
          from: window.location.pathname,
          messageToast: {
            type: "error",
            message: "Vui lòng đăng nhập để truy cập ca thi!",
          },
        }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default PrivateExamRoutes;
