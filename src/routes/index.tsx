import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './Private';
import PublicRoute from './Public';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import { GlobalStyle } from '../styles';
import { useFontSize } from '../hooks/fontSize';
import History from '../pages/History';
import Users from '../pages/Users';
import ClientAccess from '../pages/ClientAccess';

const Routes: React.FC = () => {
  const { fontSize } = useFontSize();
  return (
    <>
      <GlobalStyle fontSize={fontSize} />
      <Switch>
        <PublicRoute path="/login" exact component={SignIn} />
        {/* <PrivateRoute path="/dashboard" component={Dashboard} /> */}
        <PrivateRoute path="/history" component={History} />
        <PrivateRoute path="/users" component={Users} />
        <PrivateRoute path="/client-access" component={ClientAccess} />
        <Route path="*" component={() => <Redirect to="/login" />} />
      </Switch>
    </>
  );
};

export default Routes;
