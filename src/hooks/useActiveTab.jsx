import {useDispatch, useSelector} from "react-redux";
import {activeTab} from "~/redux/actions/activeTab.js";

function useActiveTab() {
  const state = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  const updateActiveTab = (state) => {
    dispatch(activeTab({activeTab: state}));
  }

  return {
    activeTab: state,
    updateActiveTab
  }
}

export default useActiveTab;