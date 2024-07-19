import authReducer from "./auth.js";
import {combineReducers} from "redux";
import drawerListReducer from "~/redux/reducers/drawerList.js";
import modalLoginReducer from "~/redux/reducers/modalLogin.js";
import modalRegisterReducer from "~/redux/reducers/modalRegister.js";

const allReducers = combineReducers({
  auth: authReducer,
  drawerList: drawerListReducer,
  modalLogin: modalLoginReducer,
  modalRegister: modalRegisterReducer
  // Add more reducers here
})

export default allReducers;