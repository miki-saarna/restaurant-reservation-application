export default function reservationTimeValidator(setFrontEndValidationError, date, time) {
    // get present time in UTC
    const presentDateUTC = new Date();
    // get timezone offset in ms
    const timezoneOffset = presentDateUTC.getTimezoneOffset() * 60000;
    // get present date/time with timezone consideration
    // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
    const presentDate = new Date(presentDateUTC.getTime() - timezoneOffset);
    
    // separate year, month, day
    const dateArray = date.split('-')
    // new Date() format requires month index, which is 0 indexed
    dateArray[1] -= 1;
    // separate hour, minute, second
    const timeArray = time.split(':')
    
    const reservationDateUTC = new Date(...dateArray, ...timeArray);
    // get reservation date/time with timezone consideration
    // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
    const reservationDate = new Date(reservationDateUTC.getTime() - timezoneOffset)
    
    
    // validation if reservation date is in the past
    if (reservationDate - presentDate < 0) {
      setFrontEndValidationError({ message: `Reservation date and time cannot be for a past date. Must be for a future date.`})
      return true;
    }
  
    // validation if reservation is on a tuesday
    if (reservationDate.getDay() === 2) {
      setFrontEndValidationError({ message: `Our restaurant is closed on Tuesday to allow the employees time to rest and enjoy their day.`})
      return true;
    }
  
    // validation if reservation is not during open hours
    if (time < '10:30:00') {
      setFrontEndValidationError({ message: `The restaurant does not open until 10:30 AM.`})
      return true;
    }
  
    if (time > '21:30:00') {
      setFrontEndValidationError({ message: `Please make a reservation at least 1 hour prior to closing. The restaurant closes at 10:30 PM.`})
      return true;
    }
}