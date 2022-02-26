import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DetailedTable from "../tables/DetailedTable";
import DetailedReservation from "../reservations/DetailedReservation";
import { previous, next, today } from "../utils/date-time";
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

  const [newDate, setNewDate] = useState(date);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [APIRequestError, setAPIRequestError] = useState(null);
  const [updateReservation, setUpdateReservation] = useState(false);
  const [updateTables, setUpdateTables] = useState(false);
  
  
  useEffect(() => {
    const abortController = new AbortController();
    Promise.all([listReservations({ date: newDate }, abortController.signal), listTables(abortController.signal)])
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
  }, [newDate, updateReservation, updateTables])

  const dateChangeHandler = (event) => {
    event.preventDefault();
    const dateButton = event.target.id;
    if (dateButton === 'previous') {
      setNewDate(previous(newDate))
    } else if (dateButton === 'next') {
      setNewDate(next(newDate))
    } else {
      setNewDate(today(newDate))
    }
  }

  return (
    <main>

      <div>
        <h1>Reservations</h1>
        <h2>Dashboard</h2>
        
        <div>
          <h5>Reservations for date:</h5>
          <h5>{newDate}</h5>
        </div>
      </div>

      <ErrorAlert error={APIRequestError} />

      <div className='dateChangeBtns'>
        <button onClick={dateChangeHandler} id='previous'></button>
        <button onClick={dateChangeHandler} id='present'>Today</button>
        <button onClick={dateChangeHandler} id='next'></button>
      </div>
      

      <hr />

      <section>
        <h3>Reservations:</h3>
        <div className='reservations'>{reservations.length ? reservations : null}</div>
      </section>

      <hr />

      <section>
        <h3>Tables:</h3>
        <div className='tables'>{tables.length ? tables : null}</div>
      </section>

    </main>
  );
}

export default Dashboard;
