import React, { useState } from 'react';
import ReservationForm from './ReservationForm';
import { initialFormState } from '../utils/initialformState';

export default function CreateReservation() {
    
    const [reservation, setReservation] = useState(initialFormState);

    return (
        <ReservationForm action='create' reservation={reservation} setReservation={setReservation} />
    )
}