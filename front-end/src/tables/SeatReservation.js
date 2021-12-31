import React, { useState, useEffect } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import { listTables } from '../utils/api';
import { assignReservationToTable } from '../utils/api';

export default function SeatReservation() {
    const { reservation_id } = useParams();
    const history = useHistory();

    const [listOfTables, setListOfTables] = useState([]);
    const [listOfTablesError, setListOfTablesError] = useState(null);
    const [selected, setSelected] = useState(null)
    const [validationError, setValidationError] = useState()

    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setListOfTables)
            .catch(setListOfTables)
        return () => abortController.abort();
    }, [])

    // using filter to only list out tables if they are not currently occupied
    const listOutTables = listOfTables.filter((table) => !table.reservation_id).map((table) => (
        <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    ))

    const selectHandler = () => {
        // unsure if this is the best way to obtain the value of table_id
        const tableId = document.getElementById('table_id').value;
        setSelected(tableId);
    }
    
    const submitHandler = (event) => {
        event.preventDefault();
        assignReservationToTable(selected, reservation_id)
            .then(() => {
                setSelected(null)
                return history.push('/')
            })
            .catch(setValidationError)
    }
    
    const cancelHandler = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <>  
            <label htmlFor='table_id'>Select a table to assign to reservation {reservation_id}. </label>
            Table number:
            <select name='table_id' id='table_id' onChange={selectHandler}>
                {listOutTables}
            </select>
            <button onClick={submitHandler}>Submit</button>
            <button onClick={cancelHandler}>Cancel</button>
            {validationError ? validationError.message : null}
        </>
    )
}
