import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
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

    const history = useHistory();

    const [updateStatusError, setUpdateStatusError] = useState('');

    const cancelHandler = (event) => {
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            Promise.resolve(updateReservationStatus(reservation_id, 'cancelled'))
                // checking if cancelling from search page or other page
                .then(() => setUpdateReservation ? setUpdateReservation(currentStatus => !currentStatus) : history.push('/'))
                .catch(setUpdateStatusError)
        }
    }

    return (
        <>
            <ul className='reservation'>
                <li>
                    First name: <span className='detail'>{first_name}</span>
                </li>
                <li>
                    Last name: <span className='detail'>{last_name}</span>
                </li>
                <li>
                    Number: <span className='detail'>{mobile_number}</span>
                </li>
                <li>
                    Date: <span className='detail'>{reservation_date}</span>
                </li>
                <li>
                    Time: <span className='detail'>{reservation_time}</span>
                </li>
                <li>
                    People: <span className='detail'>{people}</span>
                </li>
                <li data-reservation-id-status={reservation_id}>
                    Status: <span className='detail status'>{status}</span>
                </li>
                {/* can I remove the button below? Or do the tests rely on it? */}
                {/* below validation required? */}
                {status === 'booked'
                    ?
                    <>
                        <Link to={`/reservations/${reservation_id}/seat`}><button className='seat'>Seat</button></Link>
                        <Link to={`/reservations/${reservation_id}/edit`}><button className='edit'>Edit</button></Link>
                        <button data-reservation-id-cancel={reservation_id} onClick={cancelHandler} className='cancel'>Cancel</button>
                    </>
                    : null}
            </ul>
            <ErrorAlert error={updateStatusError} />
        </>
    )
}