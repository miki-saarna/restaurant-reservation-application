import React, { useState, useEffect } from 'react';
import { useParams, useHistory  } from 'react-router-dom';
import { listTables } from '../utils/api';
import { assignReservationToTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function SeatReservation() {
    const { reservation_id } = useParams();
    const history = useHistory();


    const [tableOptions, setTableOptions] = useState([]);
    const [tableOptionsError, setTableOptionsError] = useState([]);
    const [selected, setSelected] = useState(null);
    const [validationError, setValidationError] = useState()

    // used to create each table option for the selector
    const tableOption = (table) => <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
    
    useEffect(() => {
        async function loadTables() {
            const abortController = new AbortController();
            try {
                const tables = await listTables(abortController.signal);
                const listOutTables = tables.map((table) => tableOption(table));
                setTableOptions(listOutTables);
                setSelected(listOutTables[0].key)
            } catch (error) {
                setTableOptionsError(error);
            }
            return () => abortController.abort();
        }
        loadTables();
    }, []);

    const selectHandler = () => {
        const tableId = document.getElementById('table_id').value;
        setSelected(tableId);
    }
    
    // add async to event???
    const submitHandler = (event) => {
        event.preventDefault();
        assignReservationToTable(selected, reservation_id)
            .then(() => {
                setSelected(null);
                return history.push('/')
            })
            .catch(setValidationError)
    }
    
    const cancelHandler = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <form className='create assignment'>  
            <label htmlFor='table_id'>Select a table to assign to reservation {reservation_id}</label>
            <select name='table_id' id='table_id' onChange={selectHandler} >
                {tableOptions}
            </select>
            <button type='submit' onClick={submitHandler}>Submit</button>
            <button onClick={cancelHandler}>Cancel</button>
            {tableOptionsError.length ? <ErrorAlert error={tableOptionsError} /> : null}
            {validationError ? <ErrorAlert error={validationError} /> : null}
        </form>
    )
}
