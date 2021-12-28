import React from 'react';

// export default function DetailedTable({ table }) {
    export default function DetailedTable({ table: {table_id, table_name, capacity} }) {
    return (
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
        </ul>
    )
}