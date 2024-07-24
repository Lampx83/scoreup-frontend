import {useDispatch, useSelector} from "react-redux";

export default function useFilterQuestion() {
  const filter = useSelector((state) => state.filterQuestion);
  const dispatch = useDispatch();

  const updateFilter = (selectedCertificate, selectedSections, certificateInfo) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: {
        selectedCertificate,
        selectedSections,
        certificateInfo
      }
    });
  }

  return {
    filter,
    updateFilter
  }
}