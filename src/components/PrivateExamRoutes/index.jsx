import useAuth from "~/hooks/useAuth.jsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PrivateExamRoutes() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return (
      <Navigate
        to="/auth/login"
        state={{
          from: location.pathname,
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
