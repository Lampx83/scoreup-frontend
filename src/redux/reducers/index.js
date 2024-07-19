import authReducer from "./auth.js";
import {combineReducers} from "redux";
import drawerListReducer from "~/redux/reducers/drawerList.js";
import modalLoginReducer from "~/redux/reducers/modalLogin.js";

const allReducers = combineReducers({
  auth: authReducer,
  drawerList: drawerListReducer,
  modalLogin: modalLoginReducer,
  // Add more reducers here
})

export default allReducers;