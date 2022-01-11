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
  const [updateTables, setUpdateTables] = useState(false);

  useEffect(loadDashboard, [date, updateReservation, updateTables]);

  function loadDashboard() {
    const abortController = new AbortController();
    
    Promise.all([listReservations({ date }, abortController.signal), listTables(abortController.signal)])
      .then((response) => {
        const listOfReservations = response[0].map((reservation) =>
          <DetailedReservation key={reservation.reservation_id} reservation={reservation} setUpdateReservation={setUpdateReservation} />
          )
          setReservations(listOfReservations);

        const tablesList = response[1].map((table) =>
          <DetailedTable key={table.table_id} table={table} setUpdateReservation={setUpdateReservation} setUpdateTables={setUpdateTables} />
          ) 
          setTables(tablesList)
      })
      .catch(setAPIRequestError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h2>Dashboard</h2>

      <div>
        {/* is line break the best method? */}
        <h5>Reservations for date: <br/>{date}</h5>
      </div>
      
      <ErrorAlert error={APIRequestError} />

      <hr />

      <div>
        <h3>Today's reservations:</h3>
        <div className='reservations'>{reservations.length ? reservations : null}</div>
      </div>

      <hr />

      <div>
        <h3 className='tablesTitle'>Tables:</h3>
        <div className='tables'>{tables.length ? tables : null}</div>
      </div>

    </main>
  );
}

export default Dashboard;
