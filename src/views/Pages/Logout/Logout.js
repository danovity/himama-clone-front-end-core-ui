import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Row
} from "reactstrap";

import { Route, useHistory } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Logout() {
  let history = useHistory();
  const handleSubmit = event => {
    event.preventDefault();
    const cookies = new Cookies();

    cookies.remove("emailAddress");
    cookies.remove("userId");
    history.push("/login");
  };

  return (
    <Route
      render={props => (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <Form>
                        <h1>Are you sure you want to log out?</h1>
                        <Row>
                          <Col xs="6">
                            <Button
                              color="primary"
                              className="px-4"
                              onClick={handleSubmit}
                            >
                              LOG OUT
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
      )}
    />
  );
}
