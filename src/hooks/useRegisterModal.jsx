import {useDispatch, useSelector} from "react-redux";
import {modalRegister} from "~/redux/actions/modalRegister.js";

function useRegisterModal() {
  const open = useSelector((state) => state.modalRegister.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(modalRegister(false));

  const handleOpen = () => dispatch(modalRegister(true));

  return {
    open,
    handleClose,
    handleOpen
  }
}

export default useRegisterModal;