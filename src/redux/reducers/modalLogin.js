const modalLoginReducer = (state = {isOpen: false}, action) => {
  switch (action.type) {
    case 'TRIGGER_MODAL_LOGIN':
      return {isOpen: action.isOpen};
    default:
      return state;
  }
}

export default modalLoginReducer;