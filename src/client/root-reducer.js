import { combineReducers } from 'redux';
import { reducer as customers } from './coustomer/customers.redux';
import { reducer as singleCustomer } from './singleCustomer/singleCustomer.redux'
import { reducer as courseStatic } from './courseStatic/courseStatic.redux'

const rootReducer = combineReducers({customers, singleCustomer, courseStatic });

export default rootReducer;
