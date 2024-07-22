import {useDispatch, useSelector} from "react-redux";
import setOpen from "~/redux/actions/userSideBar.js";

function useSideBar() {
  const sideBar = useSelector((state) => state.sideBar);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(setOpen(true));
  }

  const handleDrawerClose = () => {
    dispatch(setOpen(false));
  }

  return {
    open: sideBar.open,
    handleDrawerOpen,
    handleDrawerClose
  }
}

export default useSideBar;