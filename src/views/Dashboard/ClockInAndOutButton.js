import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Button } from "reactstrap";
import Cookies from "js-cookie";
import { oc } from "ts-optchain";

const USER_SHIFT_QUERY = gql`
  query UserShiftQuery($id: ID!) {
    User(id: $id) {
      ... on User {
        id
        emailAddress
        currentShiftStatus {
          id
          shiftActionType
          time
        }
      }
    }
  }
`;

export default function ClockInAndOutButton({
  toggleClockInAndOut,
  buttonType
}) {
  const userId = Cookies.get("userId");
  const { data } = useQuery(USER_SHIFT_QUERY, {
    variables: {
      id: userId
    }
  });

  const user = oc(data).User();

  if (!user) return null; // return error

  return (
    <p className="lead">
      <Button
        color={buttonType === "CLOCK_IN" ? "primary" : "danger"}
        onClick={toggleClockInAndOut}
        size="lg"
        block
      >
        {buttonType === "CLOCK_IN" ? "CLOCK IN" : "CLOCK OUT"}
      </Button>
    </p>
  );
}
