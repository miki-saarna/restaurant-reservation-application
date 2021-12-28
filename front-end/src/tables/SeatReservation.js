import React, { useState, useEffect } from 'react';
import { useRouteMatch, useParams, useHistory  } from 'react-router-dom';
import { listTables } from '../utils/api';

export default function SeatReservation() {
    const { reservation_id } = useParams();
    console.log(reservation_id)

    const [listOfTables, setListOfTables] = useState([]);
    const [listOfTablesError, setListOfTablesError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        listTables(abortController.signal)
            .then(setListOfTables)
            .catch(setListOfTables)
        return () => abortController.abort();
    }, [])

    const listOutTables = listOfTables.map((table) => (
        <option>{table.table_name} - {table.capacity}</option>
    ))

    return (
        <select name='table_id'>
            {listOutTables}
        </select>

    )
}
