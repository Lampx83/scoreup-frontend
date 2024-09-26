import useAuth from "~/hooks/useAuth.jsx";
import LayoutDefault from "~/layout/LayoutDefault/index.jsx";
import {Navigate} from "react-router-dom";

function IndexPage() {
  const auth = useAuth();

  return (
    auth.isAuthenticated() ? (<LayoutDefault/>) : (<Navigate to={'/homepage'}/>)
  )
}

export default IndexPage;
