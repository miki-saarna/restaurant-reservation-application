import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import reservationTimeValidator from '../utils/validators/reservationTimeValidator';
import reservationFormatValidator from '../utils/validators/reservationFormatValidator';

export default function NewReservation() {

    const history = useHistory();

    const initialFormState = {
        first_name: '',
        last_name: '',
        mobile_number: '',
        reservation_date: '',
        reservation_time: '',
        people: ''
    }
    
    const [formData, setFormData] = useState(initialFormState);
    const [frontendValidationError, setFrontendValidationError] = useState('');
    const [validationError, setValidationError] = useState('');

    const changeHandler = ({ target: { name, value } }) => {
        if (name === 'people') {
            value = parseInt(value);
        }
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();
        // remove any pre-existing frontend-validation errors
        setFrontendValidationError('')

        // front-end validation on attempting to submit empty field(s)
        // const nullValues = [];
        // Object.entries(formData).forEach(([k, v]) => {
        //     if (!v) nullValues.push(k);
        // })
        // if (nullValues.length) {
        //     return setFrontendValidationError({
        //         message: `Do not leave the following field(s) empty: ${nullValues.join(', ')}`
        //     });
        // }

        // // front-end validation for reservation date and time
        reservationTimeValidator(setFrontendValidationError, formData.reservation_date, formData.reservation_time)
        // // front-end validation for mobile number and reservation size
        reservationFormatValidator(setFrontendValidationError, formData.mobile_number, formData.people)

        // API call
        createReservation(formData)
            .then(() => {
                setFormData(initialFormState)
                return history.push(`/dashboard?date=${formData.reservation_date}`)
            })
            .catch(setValidationError);
    }
    

    const cancelHandler = (event) => {
        event.preventDefault();
        return history.goBack();
    }

    return (
        <form>
            <label htmlFor='first_name'>
                First name:
            </label>
            <input
                name='first_name'
                id='first_name'
                required
                onChange={changeHandler}
                value={formData.first_name}
                type='text'
                >
            </input>

            <label htmlFor='last_name'>
                Last name:
            </label>
            <input
                name='last_name'
                id='last_name'
                required
                onChange={changeHandler}
                value={formData.last_name}
                type='text'
                >
            </input>

            <label htmlFor='mobile_number'>
                Mobile number:
            </label>
            <input
                name='mobile_number'
                id='mobile_number'
                required
                onChange={changeHandler}
                value={formData.mobile_number}
                type='text'
                // type='number'
                >
            </input>

            <label htmlFor='reservation_date'>
                Reservation date:
            </label>
            <input
                name='reservation_date'
                id='reservation_date'
                required
                onChange={changeHandler}
                value={formData.reservation_date}
                type='date'
                >
            </input>

            <label htmlFor='reservation_time'>
                Reservation time:
            </label>
            <input
                name='reservation_time'
                id='reservation_time'
                required
                onChange={changeHandler}
                value={formData.reservation_time}
                type='time'
                >
            </input>

            <label htmlFor='people'>
                People:
            </label>
            <input
                name='people'
                id='people'
                required
                onChange={changeHandler}
                value={formData.people}
                type='number'
                >
            </input>

            <button type='submit' onClick={submitHandler}>
                Submit reservation
            </button>
            <button type='submit' onClick={cancelHandler}>
                Cancel
            </button>
        
            <ErrorAlert error={frontendValidationError} />
            {/* {frontendValidationError.length ? <><p>Please do not leave any value(s) blank:</p><ul>{blankFields.map((error, index) => <li key={index}>{error}</li>)}</ul></> : null} */}
            <ErrorAlert error={validationError} />
            {/* line below not neccesary for tests? */}
            {/* {validationError ? <div className="alert alert-danger">Error: {validationError.message}</div> : null} */}
        </form>
    )
}