import React, { useState, useEffect } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import { listTables } from '../utils/api';
import { assignReservationToTable, updateStatusOfReservation } from '../utils/api';

export default function SeatReservation() {
    const { reservation_id } = useParams();
    const history = useHistory();

    const [mapOfTables, setMapOfTables] = useState([]);
    const [mapOfTablesError, setMapOfTablesError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [validationError, setValidationError] = useState()


    useEffect(loadTables, []);

    async function loadTables() {
        const abortController = new AbortController();
        try {
            const tables = await listTables(abortController.signal);
            const listOutTables = tables.filter((table) => !table.reservation_id).map((table) => (
                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
            ))
            setMapOfTables(listOutTables);
            // maybe not the best solution to use key?
            setSelected(listOutTables[0].key)
        } catch (error) {
            setMapOfTablesError(error);
        }
        return () => abortController.abort();
    }

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
                {mapOfTables}
            </select>
            <button onClick={submitHandler}>Submit</button>
            <button onClick={cancelHandler}>Cancel</button>
            {validationError ? validationError.message : null}
        </>
    )
}
