const modalRecommendReducer = (state = {isOpen: false}, action) => {
  switch (action.type) {
    case 'TRIGGER_MODAL_RECOMMEND':
      return {isOpen: action.isOpen};
    default:
      return state;
  }
}

export default modalRecommendReducer;