const drawerListReducer = (state = {open: false}, action) => {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return {open: action.value};
    default:
      return state;
  }
}

export default drawerListReducer;