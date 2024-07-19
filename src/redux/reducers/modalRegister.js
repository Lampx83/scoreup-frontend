const modalRegisterReducer = (state = {isOpen: false}, action) => {
  switch (action.type) {
    case 'TRIGGER_MODAL_REGISTER':
      return {isOpen: action.isOpen};
    default:
      return state;
  }
}

export default modalRegisterReducer;