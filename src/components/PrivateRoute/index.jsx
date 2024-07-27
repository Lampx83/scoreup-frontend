import useAuth from "~/hooks/useAuth.jsx";
import {Navigate, Outlet} from "react-router-dom";

function PrivateRoute() {
  const auth = useAuth();
  if (!auth.isAuthenticated()) {
    return <Navigate to="/" state={{
      messageToast: {
        type: "error",
        message: "Vui lòng đăng nhập để truy cập trang này!"
      },
    }}/>;
  }
  return <Outlet />;
}

export default PrivateRoute;