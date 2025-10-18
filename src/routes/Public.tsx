
import React from 'react';
import { Route as ReactDOMRoute, Redirect, RouteProps } from 'react-router-dom';
import * as ProjectService from '../services/projectService';

const PublicRoute: React.FC<RouteProps & { component: React.ComponentType<any> }> = ({ component: Component, ...rest }) => (
  <ReactDOMRoute
    {...rest}
    render={props =>
      !ProjectService.getCurrentProjectLocal() ? (
        React.createElement(Component, props)
      ) : (
        <Redirect
          to={{
            pathname: '/history',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default PublicRoute;
