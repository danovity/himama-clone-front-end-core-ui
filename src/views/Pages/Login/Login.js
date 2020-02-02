import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Redirect, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { oc } from "ts-optchain";
import { AuthService } from "../../Services/AuthService";

const SIGN_IN_MUTATION = gql`
  mutation UserCreateMutation($emailAddress: String!) {
    UserCreate(emailAddress: $emailAddress) {
      ... on User {
        id
        emailAddress
      }
    }
  }
`;

export default function Login() {
  const [signInMutation] = useMutation(SIGN_IN_MUTATION);
  const [emailAddress, setEmailAddress] = useState("");
  const [cookies, setCookie] = useCookies(["emailAddress"]);
  const [userIdCookies, setUserIdCookie] = useCookies(["userId"]);

  const handleSubmit = event => {
    event.preventDefault();

    signInMutation({
      variables: {
        emailAddress: emailAddress
      }
    }).then(({ data }) => {
      console.log("data", data);
      const user = oc(data).UserCreate();

      if (user.emailAddress && user.id) {
        setCookie("emailAddress", user.emailAddress);
        setUserIdCookie("userId", user.id);
      }
    });
  };

  return (
    <Route
      render={props =>
        AuthService.loggedIn() ? (
          <Redirect to={{ pathname: "/dashboard" }} />
        ) : (
          <div className="app flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="8">
                  <CardGroup>
                    <Card className="p-4">
                      <CardBody>
                        <Form>
                          <h1>Login</h1>
                          <p className="text-muted">
                            Returning user, Please sign-in using your email
                            address
                          </p>
                          <p className="text-muted">
                            New User, Please enter your email address to start
                          </p>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="icon-user" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Email Address"
                              onChange={event =>
                                setEmailAddress(event.target.value)
                              }
                            />
                          </InputGroup>
                          <Row>
                            <Col xs="6">
                              <Button
                                color="primary"
                                className="px-4"
                                onClick={handleSubmit}
                              >
                                Login
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                    <Card
                      className="text-white bg-primary py-5 d-md-down-none"
                      style={{ width: "44%" }}
                    >
                      <CardBody className="text-center">
                        <div>
                          <h2>Sign up</h2>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                          </p>
                          <Link to="/register">
                            <Button
                              color="primary"
                              className="mt-3"
                              active
                              tabIndex={-1}
                            >
                              Register Now!
                            </Button>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        )
      }
    />
  );
}
