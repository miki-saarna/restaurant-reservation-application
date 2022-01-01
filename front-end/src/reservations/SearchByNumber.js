import React, { useState, useEffect } from 'react';
import { listReservations } from '../utils/api';
import DetailedReservation from './DetailedReservation';


export default function SearchByNumber() {

    const [number, setNumber] = useState('');
    const [reservationsByNumber, setReservationsByNumber] = useState([]);
    const [reservationsByNumberError, setReservationsByNumberError] = useState();

    const changeHandler = ({ target: { value }}) => {
        setNumber(value)
    }

    const submitHandler = (event) => {
        event.preventDefault();
        listReservations({ mobile_number: number })
            .then(data => {
                setReservationsByNumber(data)
            })
            .catch(setReservationsByNumberError)
    }

    return (
        <>
            <form onSubmit={submitHandler}>
                <label htmlFor='mobile_number'>Number look up:</label>
                <input
                    value={number}
                    onChange={changeHandler}
                    name='mobile_number'
                    id='mobile_number'
                    required
                    type='tel'
                    placeholder="Enter a customer's phone number"
                >
                </input>
                <button type='submit'>Find</button>
            </form>
            {reservationsByNumber.length ? reservationsByNumber.map((reservation, index) => <DetailedReservation key={index} reservation={reservation} />) : <p>No reservations found</p>}
            {reservationsByNumberError ? reservationsByNumberError : null}
        </>
    )
}