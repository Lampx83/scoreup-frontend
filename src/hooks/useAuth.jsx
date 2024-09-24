import {useDispatch, useSelector} from "react-redux";
import cookies from "~/utils/cookies.js";
import {isAuthenticatedAction, logoutAction} from "~/redux/actions/auth.js";

function useAuth() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isAuthenticated = () => {
    return auth.isAuthenticated;
  }

  const login = () => {
    dispatch(isAuthenticatedAction());
    // cookies.set("token", token, { path: "/" });
  }

  const logout = () => {
    dispatch(logoutAction());
    cookies.remove("token", { path: "/"});
    cookies.remove("user");
    localStorage.clear();
  }

  return {
    isAuthenticated,
    logout,
    login
  }
}

export default useAuth;