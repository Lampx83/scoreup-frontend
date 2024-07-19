import {useDispatch, useSelector} from "react-redux";
import {modalLogin} from "~/redux/actions/modalLogin.js";

function useLoginModal() {
  const open = useSelector((state) => state.modalLogin.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(modalLogin(false));

  const handleOpen = () => dispatch(modalLogin(true));

  return {
    open,
    handleClose,
    handleOpen
  }
}

export default useLoginModal;