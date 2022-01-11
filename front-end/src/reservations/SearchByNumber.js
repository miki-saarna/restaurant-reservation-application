import React, { useState, useEffect } from 'react';
import { listReservations } from '../utils/api';
import DetailedReservation from './DetailedReservation';
import ErrorAlert from '../layout/ErrorAlert';


export default function SearchByNumber() {

    const [number, setNumber] = useState('');
    const [reservationsByNumber, setReservationsByNumber] = useState([]);
    const [reservationsByNumberError, setReservationsByNumberError] = useState();
    const [firstSearch, setFirstSearch] = useState(false);

    const changeHandler = ({ target: { value }}) => {
        setNumber(value)
    }

    const submitHandler = (event) => {
        event.preventDefault();
        setFirstSearch(true);
        Promise.resolve(listReservations({ mobile_number: number }))
            .then(setReservationsByNumber)
            .catch(setReservationsByNumberError)
    }

    useEffect(() => {
        // expands width of input element to fit the entire placeholder text
        const searchInput = document.getElementsByClassName('searchInput');
        // for (const item of searchInput) {
            searchInput[0].setAttribute('size', searchInput[0].getAttribute('placeholder').length)
        // }
    }, [])

    return (
        <div className='searchPageContent'>
            <form onSubmit={submitHandler} className='search'>
                <label htmlFor='mobile_number'>Number look up:</label>
                <input
                    className='searchInput'
                    value={number}
                    onChange={changeHandler}
                    name='mobile_number'
                    id='mobile_number'
                    required
                    type='tel'
                    placeholder="Enter a customer's phone number"
                >
                </input>
                <button type='submit' className='submitSearch'>Find</button>
            </form>
            <div className='reservations'>{firstSearch
                ? reservationsByNumber.length ? reservationsByNumber.map((reservation, index) => <DetailedReservation key={index} reservation={reservation} />) : <p>No reservations found</p>
                : null
            }</div>
            {reservationsByNumberError ? <ErrorAlert error={reservationsByNumberError} /> : null}
        </div>
    )
}