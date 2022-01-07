import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { listReservations, editReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import reservationTimeValidator from '../utils/validators/reservationTimeValidator';
import reservationFormatValidator from '../utils/validators/reservationFormatValidator';

export default function EditReservation() {
    const { reservation_id } = useParams();
    const history = useHistory();

    // change name to formdata???
    const [reservation, setReservation] = useState({});
    const [frontendValidationError, setFrontendValidationError] = useState('');
    const [reservationLookUpError, setReservationLookUpError] = useState('');
    
    useEffect(() => {
        const abortController = new AbortController();
        listReservations({ reservation_id }, abortController.signal)
            .then(setReservation)
            .catch(setReservationLookUpError)
        return () => abortController.abort();
    }, [])

    const changeHandler = ({target: { name, value } }) => {
        if (name === 'people') {
            value = parseInt(value)
        }
        setReservation(() => ({
            ...reservation,
            [name]: value
        }))
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
        if (reservationTimeValidator(setFrontendValidationError, reservation.reservation_date, reservation.reservation_time)) {
            return
        }

        editReservation(reservation)
            .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
            // .then(() => history.goBack())
            .catch(console.error);
    }

    const cancelHandler = (event) => {
        event.preventDefault();
        return history.goBack();
    }

    return (
        <>
            <form>
                <label htmlFor='first_name'>First name:</label>
                <input
                    value={reservation.first_name}
                    onChange={changeHandler}
                    required
                    name='first_name'
                    id='first_name'
                    type='text'
                ></input>

                <label htmlFor='last_name'>Last name:</label>
                <input
                    value={reservation.last_name}
                    onChange={changeHandler}
                    required
                    name='last_name'
                    id='first_name'
                    type='text'
                ></input>

                <label htmlFor='mobile_number'>Mobile name:</label>
                <input
                    value={reservation.mobile_number}
                    onChange={changeHandler}
                    required
                    name='mobile_number'
                    id='mobile_number'
                    type='text'
                    // type='number'
                ></input>

                <label htmlFor='reservation_date'>Reservation date:</label>
                <input
                    value={reservation.reservation_date}
                    onChange={changeHandler}
                    required
                    name='reservation_date'
                    id='reservation_date'
                    type='date'
                ></input>

                <label htmlFor='reservation_time'>Reservation time:</label>
                <input
                    value={reservation.reservation_time}
                    onChange={changeHandler}
                    required
                    name='reservation_time'
                    id='reservation_time'
                    type='time'
                ></input>

                <label htmlFor='people'>People:</label>
                <input
                    value={reservation.people}
                    onChange={changeHandler}
                    required
                    name='people'
                    id='people'
                    type='number'
                ></input>
                <button type='submit' onClick={submitHandler}>Submit</button>
                <button type='submit' onClick={cancelHandler}>Cancel</button>
            </form>
            <ErrorAlert error={frontendValidationError} />
            <ErrorAlert error={reservationLookUpError} />
        </>
    )
}