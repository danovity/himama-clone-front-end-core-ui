import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { CookiesProvider } from "react-cookie";
import "./App.scss";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));
const Logout = React.lazy(() => import("./views/Pages/Logout/Logout"));

const client = new ApolloClient({
  uri: "https://himama-clone-graphql-api.herokuapp.com/graphql"
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <CookiesProvider>
          <HashRouter>
            <React.Suspense fallback={loading()}>
              <Redirect exact from="/" to="/login" />
              <Switch>
                <Route
                  exact
                  path="/login"
                  name="Login Page"
                  render={props => <Login {...props} />}
                />
                <Route
                  exact
                  path="/logout"
                  name="Log Out Page"
                  render={props => <Logout {...props} />}
                />
                <Route
                  exact
                  path="/register"
                  name="Register Page"
                  render={props => <Register {...props} />}
                />
                <Route
                  exact
                  path="/404"
                  name="Page 404"
                  render={props => <Page404 {...props} />}
                />
                <Route
                  exact
                  path="/500"
                  name="Page 500"
                  render={props => <Page500 {...props} />}
                />
                <Route
                  path="/dashboard"
                  name="Dashboard"
                  render={props => <DefaultLayout {...props} />}
                />
              </Switch>
            </React.Suspense>
          </HashRouter>
        </CookiesProvider>
      </ApolloProvider>
    );
  }
}

export default App;
