import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { listReservations, createReservation, editReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import reservationTimeValidator from '../utils/validators/reservationTimeValidator';
import reservationFormatValidator from '../utils/validators/reservationFormatValidator';

export default function CreateOrEditReservation() {

    const { reservation_id } = useParams();
    const history = useHistory();

    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: ''
    }
    
    const [reservation, setReservation] = useState(initialFormState);
    const [frontendValidationError, setFrontendValidationError] = useState('');
    const [reservationCreationError, setReservationCreationError] = useState('');
    const [reservationLookUpError, setReservationLookUpError] = useState('');
    const [reservationEditError, setReservationEditError] = useState('');
    

    useEffect(() => {
        if (reservation_id) {
        async function fetchreservations() {
            const abortController = new AbortController();
            try {
                const data = await listReservations({ reservation_id }, abortController.signal)
                setReservation(data)
            } catch(error) {
                setReservationLookUpError(error)
            }
            return () => abortController.abort();
        }
        fetchreservations();
        // don't need reservation_id as dependency, but get warning otherwise
        }
    }, [reservation_id])


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
        if (reservation_id) {
            editReservation(reservation, timezoneOffset)
                .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
                // .then(() => history.goBack())
                .catch(setReservationEditError);
        } else {
            createReservation(reservation, timezoneOffset)
                .then(() => {
                    setReservation(initialFormState)
                    return history.push(`/dashboard?date=${reservation.reservation_date}`)
                })
                .catch(setReservationCreationError);
        }
    }
    
    const cancelHandler = (event) => {
        event.preventDefault();
        return history.goBack();
    }

    return (
        <form className='create'>
            <label htmlFor='first_name'>First name:</label>
            <input
                name='first_name'
                id='first_name'
                required
                onChange={changeHandler}
                value={reservation.first_name}
                type='text'
                >
            </input>

            <label htmlFor='last_name'>Last name:</label>
            <input
                name='last_name'
                id='last_name'
                required
                onChange={changeHandler}
                value={reservation.last_name}
                type='text'
                >
            </input>

            <label htmlFor='mobile_number'>Mobile number:</label>
            <input
                name='mobile_number'
                id='mobile_number'
                required
                onChange={changeHandler}
                value={reservation.mobile_number}
                type='text'
                // type='number'
                >
            </input>

            <label htmlFor='reservation_date'>Reservation date:</label>
            <input
                name='reservation_date'
                id='reservation_date'
                required
                onChange={changeHandler}
                value={reservation.reservation_date}
                type='date'
                >
            </input>

            <label htmlFor='reservation_time'>Reservation time:</label>
            <input
                name='reservation_time'
                id='reservation_time'
                required
                onChange={changeHandler}
                value={reservation.reservation_time}
                type='time'
                >
            </input>

            <label htmlFor='people'>People:</label>
            <input
                name='people'
                id='people'
                required
                onChange={changeHandler}
                value={reservation.people}
                type='number'
                >
            </input>

            <button type='submit' onClick={submitHandler}>Submit reservation</button>
            <button type='submit' onClick={cancelHandler}>Cancel</button>
        
            <ErrorAlert error={reservationLookUpError} />
            <ErrorAlert error={frontendValidationError} />
            <ErrorAlert error={reservationCreationError} />
            <ErrorAlert error={reservationEditError} />
            {/* {frontendValidationError.length ? <><p>Please do not leave any value(s) blank:</p><ul>{blankFields.map((error, index) => <li key={index}>{error}</li>)}</ul></> : null} */}
            {/* line below not neccesary for tests? */}
            {/* {validationError ? <div className="alert alert-danger">Error: {validationError.message}</div> : null} */}
        </form>
    )
}