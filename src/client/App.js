import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';
import {Home} from './Home';
import Customer from './coustomer/customers';
import SingleCustomer from './singleCustomer/singleCustomer';
import CourseStatic from './courseStatic/courseStatic';

const App = () => (
  <div>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/dashboard">dashboard</Link></li>
    </ul>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/dashboard" component={Customer} />
      <Route exact path="/dashboard/customer/:customerId" component={SingleCustomer} />
      <Route exact path="/dashboard/students/course-statics/:studentId/:courseId" component={CourseStatic} />
    </Switch>
  </div>
);

export default App;
