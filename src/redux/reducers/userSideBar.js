const userSideBarReducer = (state = {open: true}, action) => {
  switch (action.type) {
    case 'SET_OPEN':
      return {open: action.value};
    default:
      return state;
  }
}

export default userSideBarReducer;