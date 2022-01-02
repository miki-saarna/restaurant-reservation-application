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
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  // add error below into body
  const [tablesError, setTablesError] = useState([]);
  // used to re-render list of reservations that are displayed
  const [tableFinished, setTableFinished] = useState(false);
  const [mapped, setMapped] = useState([]);

  // seems like tableFinished dependency isn't working
  useEffect(loadDashboard, [date, tableFinished]);

  function loadDashboard() {
    // console.log(date)
    // console.log(tableFinished)
    
    const abortController = new AbortController();
    // setReservationsError(null);
    // listReservations({ date }, abortController.signal)
    //   .then((data) => {
    //     console.log("list reservation:", data)
    //     setReservations(data)
    //   })
    //   .catch(setReservationsError);
    // listTables(abortController.signal)
    //   .then(data => {
    //     console.log("list tables:", data)
    //     setTables(data)
    //   })
    //   .catch(setTablesError);
    
    Promise.all([listReservations({ date }, abortController.signal), listTables(abortController.signal)])
    .then((response) => {
      const listOfReservations = response[0].filter((reservation) => !['finished', 'cancelled'].includes(reservation.status)).map((reservation) => (
        <DetailedReservation key={reservation.reservation_id} reservation={reservation} setTableFinished={setTableFinished} />
        ))
        setMapped(listOfReservations);
        
        
        // setReservations(response[0])
        const tablesList = response[1].map((table) => (
          <DetailedTable key={table.table_id} table={table} setTableFinished={setTableFinished} />
          ))
          
          setTables(tablesList)
      })
      .catch(console.error);
    return () => abortController.abort();
  }

  // useEffect(() => {
  //   console.log(mapped)
  // }, [tables])

  // const listOfReservations = reservations.filter((reservation) => !['finished', 'cancelled'].includes(reservation.status)).map((reservation) => (
  //   <DetailedReservation key={reservation.reservation_id} reservation={reservation} />
  //   ))

  // above useEffect not updating???
  // useEffect(() => {
    // const abortController = new AbortController();

    // listReservations({ date })
    //   .then(setReservations)
    //   .catch(setReservationsError);
    // return () => abortController.abort();

  // }, [tableFinished])

  

  // const TablesList = tables.map((table) => (
  //    <DetailedTable key={table.table_id} table={table} setTableFinished={setTableFinished} />
  // ))

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className='table'>
        <p>Today's reservations:</p>
        {/* {reservations.length ? listOfReservations : null} */}
        {mapped.length ? mapped : null}
      </div>
      <div className='table'>
      <p>Tables:</p>
        {tables.length ? tables : null}
      </div>
    </main>
  );
}

export default Dashboard;
