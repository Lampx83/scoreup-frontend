import {useDispatch, useSelector} from "react-redux";
import {modalRecommend} from "~/redux/actions/modalRecommend.js";
import cookies from "~/utils/cookies.js";

function useRecommendModal() {
  const open = useSelector((state) => state.modalRecommend.isOpen);
  const dispatch = useDispatch();
  const user = cookies.get("user");

  const handleClose = () => dispatch(modalRecommend({isOpen: false}));

  const handleOpen = () => {
    if (!user?.recommend) {
      return;
    }

    dispatch(modalRecommend({isOpen: true}))
  };

  return {
    open,
    handleClose,
    handleOpen
  }
}

export default useRecommendModal;