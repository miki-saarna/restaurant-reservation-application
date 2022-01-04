import React, { useState } from 'react';
import { deleteSeatAssignment } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function DetailedTable({ table, setUpdateReservation }) {
    // destructuring table
    const { table_id, table_name, capacity, reservation_id = null } = table;

    const [isReserved, setIsReserved] = useState(() => reservation_id ? true : false);
    const [deleteSeatAssignmentError, setDeleteSeatAssignmentError] = useState('');

    const handleFinish = (event) => {
        event.preventDefault();
        if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
            // Promise.resolve(deleteSeatAssignment(table_id))
            Promise.resolve(deleteSeatAssignment(table_id))
                .then(() => {
                    setUpdateReservation(currentStatus => !currentStatus)
                    setIsReserved(false)
                })
                .catch(setDeleteSeatAssignmentError)
        }
    }
        
return (
    <>
        <ul className='table'>
            <li>
                ID: {table_id}
            </li>
            <li>
                Name: {table_name}
            </li>
            <li>
                Capacity: {capacity}
            </li>
            <li>
                {/* {isReserved ? <p data-table-id-status={table_id}>Occupied</p> : <p data-table-id-status={table_id}>Free</p>} */}
                <h4 data-table-id-status={table_id}>{isReserved ? 'Occupied' : 'Free'}</h4>
            </li>
            {isReserved ? <button data-table-id-finish={table_id} onClick={handleFinish}>Finish</button> : null}
        </ul>
        <ErrorAlert error={deleteSeatAssignmentError} />
    </>
    )
}