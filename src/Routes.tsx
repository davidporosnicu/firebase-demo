import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import RegisterPage from "./pages/register-page/RegisterPage";
import LoginPage from "./pages/login-page/LoginPage";
import DashboardPage from "./pages/dashboard-page/DashboardPage";

function App() {
  const { currentUser } = useAuth();
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/dashboard" component={DashboardPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/" component={LoginPage} />
      </Switch>
    </Router>
  );

  function PrivateRoute({ component: Component, ...rest }: any) {
    return (
      <Route
        {...rest}
        render={(props) =>
          currentUser ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
}

export default App;
