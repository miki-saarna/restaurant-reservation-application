import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function NewTable() {

    const history = useHistory();

    const initialFormState = {
        table_name: '',
        capacity: '',
    }

    const [formData, setFormData] = useState(initialFormState);
    const [validationError, setValidationError] = useState('');

    const changeHandler = ({ target: { name, value }}) => {
        if (name === 'capacity') {
            value = parseInt(value)
        }
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();

        // if (formData.table_name.length < 2) {
        //     return setValidationError(`Table name must be at least 2 characters in length.`)
        // }

        // if (formData.capacity < 1) {
        //     return setValidationError(`Capacity must be 1 person or greater.`)
        // }
        createTable(formData)
        .then(() => {
            setFormData(initialFormState);
            return history.push('/');
        })
        .catch(setValidationError);
    }

    const cancelHandler = (event) => {
        event.preventDefault();
        return history.goBack();
    }


    return (
        <form>
            <label htmlFor='table_name'>Table name:</label>
            <input
                id='table_name'
                name='table_name'
                onChange={changeHandler}
                value={formData.table_name}
                required
                type='text'
            >
            </input>
            <label htmlFor='capacity'>Capacity:</label>
            <input
                id='capacity'
                name='capacity'
                onChange={changeHandler}
                value={formData.capacity}
                required
                type='number'
            >
            </input>
            <button type='submit' onClick={submitHandler}>
                Submit Table
            </button>
            <button type='submit' onClick={cancelHandler}>
                Cancel
            </button>

            {validationError ? <ErrorAlert error={validationError} /> : null}
        </form>
    )
}