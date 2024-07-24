import authReducer from "./auth.js";
import {combineReducers} from "redux";
import drawerListReducer from "~/redux/reducers/drawerList.js";
import modalLoginReducer from "~/redux/reducers/modalLogin.js";
import modalRegisterReducer from "~/redux/reducers/modalRegister.js";
import userSideBarReducer from "~/redux/reducers/userSideBar.js";
import {filterQuestionReducer} from "~/redux/reducers/filterQuestion.js";

const allReducers = combineReducers({
  auth: authReducer,
  drawerList: drawerListReducer,
  modalLogin: modalLoginReducer,
  modalRegister: modalRegisterReducer,
  sideBar: userSideBarReducer,
  filterQuestion: filterQuestionReducer
  // Add more reducers here
})

export default allReducers;