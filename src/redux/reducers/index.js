import authReducer from "./auth.js";
import {combineReducers} from "redux";

const allReducers = combineReducers({
  auth: authReducer
  // Add more reducers here
})

export default allReducers;