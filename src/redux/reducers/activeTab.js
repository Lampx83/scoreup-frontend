export const activeTabReducer = (state = "home", {type, activeTab}) => {
  switch (type) {
    case "UPDATE_ACTIVE_TAB":
      return activeTab;
    default:
      return state;
  }
}