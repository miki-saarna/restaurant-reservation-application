import React, { useState } from 'react';
import { deleteTable, deleteSeatAssignment } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function DetailedTable({ table, setUpdateReservation, setUpdateTables }) {
    // destructuring table
    const { table_id, table_name, capacity, reservation_id = null } = table;

    const [isReserved, setIsReserved] = useState(() => reservation_id ? true : false);
    // const [deleteSeatAssignmentError, setDeleteSeatAssignmentError] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const handleFinish = (event) => {
        event.preventDefault();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
            // Promise.resolve(deleteSeatAssignment(table_id))
            Promise.resolve(deleteSeatAssignment(table_id))
                .then(() => {
                    setUpdateReservation(currentStatus => !currentStatus)
                    setIsReserved(false)
                })
                .catch(setDeleteError)
                // .catch(setDeleteSeatAssignmentError)
        }
    }

    const handleDelete = (event) => {
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this table? This cannot be undone")) {
            deleteTable(table_id)
                .then(() => setUpdateTables((currentTables) => !currentTables))
                .catch(setDeleteError) 
        }
    }
        
return (
    <>
        <ul className='table'>
            <li>
                {table_name}
            </li>
            <li>
                Capacity: <span className='detail'>{capacity}</span>
            </li>
            <li data-table-id-status={table_id}> 
                {/* {isReserved ? <p data-table-id-status={table_id}>Occupied</p> : <p data-table-id-status={table_id}>Free</p>} */}
                Status: {isReserved ? <span className='detail occupied'>Occupied</span> : <span className='detail free'>Free</span>}
                {/* <h4 data-table-id-status={table_id}>Status: {isReserved ? 'Occupied' : 'Free'}</h4> */}
            </li>
            {isReserved ? <button className='button' data-table-id-finish={table_id} onClick={handleFinish}>Finish</button> : null}
            {isReserved ? null : <button className='x' onClick={handleDelete}>x</button>}
        </ul>
        <ErrorAlert error={deleteError} />
    </>
    )
}