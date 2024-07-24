export const filterQuestion = ({
  selectedCertificate,
  selectedSections
}) => {
  return {
    type: "UPDATE_FILTER",
    payload: {
      selectedCertificate,
      selectedSections
    }
  };
};
