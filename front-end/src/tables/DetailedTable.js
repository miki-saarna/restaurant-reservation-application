import React from 'react';
import { deleteSeatAssignment } from '../utils/api';

// export default function DetailedTable({ table }) {
    export default function DetailedTable({ table: {table_id, table_name, capacity, reservation_id = null} }) {

        const handleFinish = (event) => {
            event.preventDefault();

            if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
                deleteSeatAssignment(table_id)
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
                    {/* unsure if the below attribute is correct... needed for tests */}
                    <h4 data-table-id-status={table_id}>{reservation_id ? 'Occupied' : 'Free'}</h4>
                </li>
                <button data-table-id-status={table_id} onClick={handleFinish}>Finish</button>
            </ul>
        </>
    )
}