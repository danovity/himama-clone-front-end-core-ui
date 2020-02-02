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
                        <Form onSubmit={handleSubmit}>
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
