import cookies from "~/utils/cookies.js";

const initialState = {
  isAuthenticated: !!cookies.get("token")
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'IS_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export default authReducer;