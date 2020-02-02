import React, { useState, Suspense, useEffect } from "react";
import {
  Jumbotron,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from "reactstrap";
import format from "date-fns/format";
import { parseISO } from "date-fns/fp";
import gql from "graphql-tag";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { oc } from "ts-optchain";
import Cookies from "js-cookie";
import ClockInAndOutButton from "./ClockInAndOutButton";

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

const USER_INFORMATION_QUERY = gql`
  query UserInformationQuery($id: ID!) {
    User(id: $id) {
      ... on User {
        id
        emailAddress
        currentShiftStatus {
          id
          shiftActionType
          time
        }
        allShiftsStatus {
          id
          shiftActionType
          time
        }
      }
    }
  }
`;

const CLOCK_IN_AND_OUT_MUTATION = gql`
  mutation clockInAndOutMutation($id: ID!, $shiftActionType: UserShiftType!) {
    UserShiftCreate(id: $id, shiftActionType: $shiftActionType) {
      id
      time
      shiftActionType
      user {
        id
        emailAddress
        allShiftsStatus {
          id
          shiftActionType
          time
        }
      }
    }
  }
`;

export default function Dashboard(props) {
  const [shiftActionType, setShiftActionType] = useState("");
  const [timeInAndOut, setTimeInAndOut] = useState("");
  const [clockInAndOutMutation] = useMutation(CLOCK_IN_AND_OUT_MUTATION);
  const [buttonType, setButtonType] = useState("");
  const [getUserInfo, { data }] = useLazyQuery(USER_INFORMATION_QUERY);
  useEffect(() => {
    const userId = Cookies.get("userId");
    getUserInfo({ variables: { id: userId } });
    if (data && data.User) {
      if (data.User.currentShiftStatus === null) {
        setButtonType("CLOCK_IN");
        setShiftActionType("");
        setTimeInAndOut("never");
      } else if (data.User.currentShiftStatus.shiftActionType === "CLOCK_IN") {
        setButtonType("CLOCK_OUT");
        setShiftActionType("CLOCK_OUT");
        setTimeInAndOut(data.User.currentShiftStatus.time);
      } else {
        setButtonType("CLOCK_IN");
        setShiftActionType("CLOCK_IN");
        setTimeInAndOut(data.User.currentShiftStatus.time);
      }
    }
  }, [data]);

  const user = oc(data).User();
  const logs = oc(user).allShiftsStatus();

  if (!user || !timeInAndOut) return null; // return error

  const toggleClockInAndOut = event => {
    event.preventDefault();

    clockInAndOutMutation({
      variables: {
        id: user.id,
        shiftActionType: buttonType
      }
    }).then(({ data }) => {
      if (data.UserShiftCreate.shiftActionType === "CLOCK_IN") {
        setButtonType("CLOCK_OUT");
        setShiftActionType("CLOCK_OUT");
        setTimeInAndOut(data.UserShiftCreate.time);
      } else {
        setButtonType("CLOCK_IN");
        setShiftActionType("CLOCK_IN");
        setTimeInAndOut(data.UserShiftCreate.time);
      }
    });
  };

  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  return (
    <div className="animated fadeIn">
      <Row>
        <Col>
          <Suspense fallback={loading()}>
            <h3 className="display-3">User: {user.emailAddress}</h3>
            <Jumbotron>
              {timeInAndOut === "never" ? (
                <h3 className="display-3">Please Clock In to Your Shift</h3>
              ) : (
                <h3 className="display-3">
                  You Have{" "}
                  {shiftActionType === "CLOCK_IN"
                    ? "Clocked Out"
                    : "Clocked In"}{" "}
                  At{" "}
                  {format(
                    new Date(parseISO(timeInAndOut)),
                    "MMM d, yyyy h:mma"
                  )}
                </h3>
              )}

              <ClockInAndOutButton
                toggleClockInAndOut={toggleClockInAndOut}
                buttonType={buttonType}
              />
            </Jumbotron>
          </Suspense>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <CardHeader>SHIFT LOGS</CardHeader>
            <CardBody>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto"
                }}
              >
                <Table
                  hover
                  responsive
                  className="table-outline mb-0 d-none d-sm-table"
                >
                  <thead className="thead-light">
                    <tr>
                      <th>Activity</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => {
                      return (
                        <tr
                          key={log.id}
                          style={
                            log.shiftActionType === "CLOCK_IN"
                              ? { backgroundColor: "none" }
                              : { backgroundColor: "pink" }
                          }
                        >
                          <td>
                            <div>
                              {log.shiftActionType.split("_").join(" ")}
                            </div>
                          </td>
                          <td>
                            <strong>
                              {format(
                                new Date(parseISO(log.time)),
                                "MMM d, yyyy h:mma"
                              )}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
