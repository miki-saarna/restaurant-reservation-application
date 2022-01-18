import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import EditReservation from "../reservations/EditReservation";
import CreateReservation from "../reservations/CreateReservation";
import NewTable from "../tables/NewTable";
import SeatReservation from "../tables/SeatReservation";
import SearchByNumber from "../reservations/SearchByNumber";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <>
    
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route exact path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route exact path="/tables/new">
        <NewTable />
      </Route>
      <Route exact path="/search">
        <SearchByNumber />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
    </>
  );
}

export default Routes;
