
const initState = JSON.parse(localStorage.getItem("filter")) || {};

export const filterQuestionReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case "UPDATE_FILTER":
      localStorage.setItem("filter", JSON.stringify({certificateDatabaseId: payload.selectedCertificate, tags: payload.selectedSections, certificateInfo: payload.certificateInfo}));
      return {certificateDatabaseId: payload.selectedCertificate, tags: payload.selectedSections, certificateInfo: payload.certificateInfo};
    default:
      return state;
  }
}