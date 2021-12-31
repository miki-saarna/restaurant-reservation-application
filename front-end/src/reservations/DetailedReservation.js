import React from 'react';
import { Link } from 'react-router-dom';

export default function DetailedReservation({ reservation }) {
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

    return (
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
            {status === 'booked' ? <button><Link to={`/reservations/${reservation_id}/seat`}>Seat</Link></button> : null}
        </ul>
    )
}