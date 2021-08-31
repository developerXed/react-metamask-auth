import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const getToken = () => {
  return localStorage.getItem('token') || null;
}

// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/about', state: { from: props.location } }} />}
    />
  )
}

export default PrivateRoute;