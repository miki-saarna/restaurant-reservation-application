import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateReservationStatus } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function DetailedReservation({ reservation, setUpdateReservation }) {
    // destructuring reservation
    const {
        reservation_id,
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people,
        status,
    } = reservation;

    const [updateStatusError, setUpdateStatusError] = useState('')

    const cancelHandler = (event) => {
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            Promise.resolve(updateReservationStatus(reservation_id, 'cancelled'))
                .then(() => setUpdateReservation(currentStatus => !currentStatus))
                .catch(setUpdateStatusError)
        }
    }

    return (
        <>
            <ul className='table'>
                <li>
                    Reservation ID: {reservation_id}
                </li>
                <li>
                    First name: {first_name}
                </li>
                <li>
                    Last name: {last_name}
                </li>
                <li>
                    Number: {mobile_number}
                </li>
                <li>
                    Date: {reservation_date}
                </li>
                <li>
                    Time: {reservation_time}
                </li>
                <li>
                    People: {people}
                </li>
                <li data-reservation-id-status={reservation.reservation_id}>
                    Status: {status}
                </li>
                {/* can I remove the button below? Or do the tests rely on it? */}
                {/* below validation required? */}
                {status === 'booked'
                    ?
                    <>
                        <button><Link to={`/reservations/${reservation_id}/seat`}>Seat</Link></button>
                        <button><Link to={`/reservations/${reservation_id}/edit`}>Edit</Link></button>
                        <button data-reservation-id-cancel={reservation_id} onClick={cancelHandler}>Cancel</button>
                    </>
                    : null}
            </ul>
            <ErrorAlert error={updateStatusError} />
        </>
    )
}