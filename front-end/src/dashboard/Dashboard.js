import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DetailedTable from "../tables/DetailedTable";
import DetailedReservation from "../reservations/DetailedReservation";
// import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

// custom function/hook created to get value from query parameter
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard({ date }) {
  const query = useQuery();
  const dateFromQuery = query.get("date");
  if (dateFromQuery) {
    date = dateFromQuery;
  }

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [APIRequestError, setAPIRequestError] = useState(null);
  // used to re-render list of reservations that are displayed
  const [updateReservation, setUpdateReservation] = useState(false);

  useEffect(loadDashboard, [date, updateReservation]);

  function loadDashboard() {
    const abortController = new AbortController();
    
    Promise.all([listReservations({ date }, abortController.signal), listTables(abortController.signal)])
      .then((response) => {
        const listOfReservations = response[0].map((reservation) =>
          <DetailedReservation key={reservation.reservation_id} reservation={reservation} setUpdateReservation={setUpdateReservation} />
          )
          setReservations(listOfReservations);

        const tablesList = response[1].map((table) =>
          <DetailedTable key={table.table_id} table={table} setUpdateReservation={setUpdateReservation} />
          ) 
          setTables(tablesList)
      })
      .catch(setAPIRequestError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={APIRequestError} />
      <div className='table'>
        <p>Today's reservations:</p>
        {reservations.length ? reservations : null}
      </div>
      <div className='table'>
      <p>Tables:</p>
        {tables.length ? tables : null}
      </div>
    </main>
  );
}

export default Dashboard;
