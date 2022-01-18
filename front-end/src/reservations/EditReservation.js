import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listReservations } from '../utils/api';
import ReservationForm from './ReservationForm';
import { initialFormState } from '../utils/initialformState';
import ErrorAlert from '../layout/ErrorAlert';

export default function CreateReservation() {
    const { reservation_id } = useParams();
    
    const [reservation, setReservation] = useState(initialFormState);
    const [reservationLookUpError, setReservationLookUpError] = useState('');
    
    useEffect(() => {
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
    }, [reservation_id])

    return (
        <>
            <ReservationForm action='edit' reservation={reservation} setReservation={setReservation} errors={reservationLookUpError} />
            <ErrorAlert error={reservationLookUpError} />
        </>
    )
}