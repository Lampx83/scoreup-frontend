import {useDispatch, useSelector} from "react-redux";
import {modalRecommend} from "~/redux/actions/modalRecommend.js";

function useRecommendModal() {
  const open = useSelector((state) => state.modalRecommend.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(modalRecommend({isOpen: false}));

  const handleOpen = () => dispatch(modalRecommend({isOpen: true}));

  return {
    open,
    handleClose,
    handleOpen
  }
}

export default useRecommendModal;