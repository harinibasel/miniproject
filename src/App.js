import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import('./users/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./users/pages/Auth'));

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token !== null && token !== undefined) {
    routes = (
      <Switch>
        <Route path="/" exact key="users">
          <Users />
        </Route>
        <Route path="/:userId/places" exact key="user-places">
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact key="new-place">
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" key="update-place">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact key="users">
          <Users />
        </Route>
        <Route path="/:userId/places" exact key="user-places">
          <UserPlaces />
        </Route>
        <Route path="/auth" key="auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token !== null && token !== undefined,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router basename="/">
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;