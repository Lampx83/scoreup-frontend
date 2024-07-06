import authReducer from "./auth.js";
import {combineReducers} from "redux";
import drawerListReducer from "~/redux/reducers/drawerList.js";

const allReducers = combineReducers({
  auth: authReducer,
  drawerList: drawerListReducer,
  // Add more reducers here
})

export default allReducers;