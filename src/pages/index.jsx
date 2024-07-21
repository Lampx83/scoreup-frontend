import useAuth from "~/hooks/useAuth.jsx";
import UserHomePage from "~/pages/UserHomePage/index.jsx";
import HomePage from "~/pages/HomePage/index.jsx";
import LayoutDefault from "~/layout/LayoutDefault/index.jsx";

function IndexPage() {
  const auth = useAuth();

  return (
    auth.isAuthenticated() ? (<LayoutDefault/>) : (<HomePage/>)
  )
}

export default IndexPage;