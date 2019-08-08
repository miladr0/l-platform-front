import { all } from 'redux-saga/effects'
import { customersSagas } from "./coustomer/customers.redux";
import { singleCustomerSagas } from "./singleCustomer/singleCustomer.redux";
import { courseStaticSagas } from "./courseStatic/courseStatic.redux";

// single entry point to start all Sagas at once
export default function* rootSaga() {
  const customers = customersSagas();
  const singleCustomer = singleCustomerSagas();
  const courseStatic = courseStaticSagas();
  
  const final = [].concat(
    customers,
    singleCustomer,
    courseStatic
  );

  yield all([
    final
  ]);
}
