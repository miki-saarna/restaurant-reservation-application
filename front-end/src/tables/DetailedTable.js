import React, { useState, useEffect } from 'react';
import { deleteSeatAssignment, updateStatusOfReservation } from '../utils/api';

// export default function DetailedTable({ table }) {
    export default function DetailedTable({ table: {table_id, table_name, capacity, reservation_id = null}, setTableFinished }) {

        const [isReserved, setIsReserved] = useState(() => reservation_id ? true : false);
        
        // how to properly implement useEffect since there's an API call...
        // do I need to useState with another variable?
        const handleFinish = (event) => {
            event.preventDefault();
            if (window.confirm("Is this table ready to seat new guests? This cannot be undone")) {
                // use Promise.resolve below or make async/await???
                Promise.resolve(deleteSeatAssignment(table_id))
                    .then(() => {
                        setTableFinished(currentStatus => !currentStatus)
                        setIsReserved(false)
                    })
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
                    <h4 data-table-id-status={table_id}>{isReserved ? 'Occupied' : 'Free'}</h4>
                </li>
                {isReserved ? <button data-table-id-finished={table_id} onClick={handleFinish}>Finish</button> : null}
            </ul>
        </>
    )
}