import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation, editReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import reservationTimeValidator from '../utils/validators/reservationTimeValidator';
import reservationFormatValidator from '../utils/validators/reservationFormatValidator';
import { initialFormState } from '../utils/initialformState';

export default function ReservationForm({ action, reservation, setReservation }) {
    const history = useHistory();
    
    const {
        first_name,
        last_name,
        mobile_number,
        reservation_date,
        reservation_time,
        people
    } = reservation;

    const [frontendValidationError, setFrontendValidationError] = useState('');
    const [reservationEditError, setReservationEditError] = useState('');
    const [reservationCreationError, setReservationCreationError] = useState('');

    const changeHandler = ({ target: { name, value } }) => {
        if (value && name === 'people') {
            value = parseInt(value);
        }
        setReservation({
            ...reservation,
            [name]: value,
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();
        // remove any pre-existing frontend-validation errors
        setFrontendValidationError('')

        // // front-end validation for mobile number and reservation size. If true (validation fails), return to stop function from executing API call
        if(reservationFormatValidator(setFrontendValidationError, reservation)) {
            return
        }
        // // front-end validation for reservation date and time. If true (validation fails), return to stop function from executing API call
        const timezoneOffset = reservationTimeValidator(setFrontendValidationError, reservation.reservation_date, reservation.reservation_time)
        if (!Number.isInteger(timezoneOffset)) {
            return;
        }

        // API call
        const abortController = new AbortController();
        if (action === 'create') {
            createReservation(reservation, timezoneOffset, abortController.signal)
                .then(() => {
                    setReservation(initialFormState)
                    return history.push(`/dashboard?date=${reservation.reservation_date}`)
                })
                .catch(setReservationCreationError);
        } else {
            editReservation(reservation, timezoneOffset, abortController.signal)
            .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
            // .then(() => history.goBack())
            .catch(setReservationEditError);
        }
        return () => abortController.abort();
    }

    const cancelHandler = (event) => {
        event.preventDefault();
        return history.goBack();
    }

    const errorsArray = [];
    const potentialErrors = [frontendValidationError, reservationCreationError, reservationEditError];
    potentialErrors.forEach((potentialError) => {
        if (potentialError) {
            errorsArray.push(potentialError);
        }
    })
    const listOfErrorFunctions = errorsArray.map((error, index) => <ErrorAlert key={index} error={error} />);

    return (
        <form className='create'>
            <label htmlFor='first_name'>First name:</label>
            <input
                name='first_name'
                id='first_name'
                required
                onChange={changeHandler}
                value={first_name}
                type='text'
                >
            </input>

            <label htmlFor='last_name'>Last name:</label>
            <input
                name='last_name'
                id='last_name'
                required
                onChange={changeHandler}
                value={last_name}
                type='text'
                >
            </input>

            <label htmlFor='mobile_number'>Mobile number:</label>
            <input
                name='mobile_number'
                id='mobile_number'
                required
                onChange={changeHandler}
                value={mobile_number}
                type='text'
                >
            </input>

            <label htmlFor='reservation_date'>Reservation date:</label>
            <input
                name='reservation_date'
                id='reservation_date'
                required
                onChange={changeHandler}
                value={reservation_date}
                type='date'
                >
            </input>

            <label htmlFor='reservation_time'>Reservation time:</label>
            <input
                name='reservation_time'
                id='reservation_time'
                required
                onChange={changeHandler}
                value={reservation_time}
                type='time'
                >
            </input>

            <label htmlFor='people'>People:</label>
            <input
                name='people'
                id='people'
                required
                onChange={changeHandler}
                value={people}
                type='number'
                >
            </input>

            <button type='submit' onClick={submitHandler}>Submit reservation</button>
            <button type='submit' onClick={cancelHandler}>Cancel</button>

            {listOfErrorFunctions}
        </form>
)
}