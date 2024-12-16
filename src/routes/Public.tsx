import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';
import * as ProjectService from '../services/projectService';

interface RouteProps extends ReactDOMRouteProps {
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return !ProjectService.getCurrentProjectLocal() ? (
          <Component />
        ) : (
          <Component />
          // <Redirect
          //   to={{
          //     pathname: '/dashboard',
          //     state: { from: location },
          //   }}
          // />
        );
      }}
    />
  );
};

export default Route;
