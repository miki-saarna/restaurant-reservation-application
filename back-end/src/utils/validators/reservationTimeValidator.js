function reservationTimeValidator() {
    return function(req, res, next) {
        const { data: { reservation_date, reservation_time }, timezoneOffset } = req.body;
        // get present time in UTC
        const presentDateUTC = new Date();
        // get timezone offset in ms
        // const timezoneOffset = presentDateUTC.getTimezoneOffset() * 60000;
        // get present date/time with timezone consideration
        // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
        const presentDate = new Date(presentDateUTC.getTime() - timezoneOffset);
        
        // separate year, month, day
        const dateArray = reservation_date.split('-')
        // new Date() format requires month index, which is 0 indexed
        dateArray[1] -= 1;
        // separate hour, minute, second
        const timeArray = reservation_time.split(':')
        
        const reservationDate = new Date(...dateArray, ...timeArray);
        // get reservation date/time with timezone consideration
        // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
        // const reservationDate = new Date(reservationDateUTC.getTime() - timezoneOffset)
        
        // validation if reservation date is in the past
        // if (reservationDate - presentDateUTC < 0) {
        if (reservationDate - presentDate < 0) {
        // the line below is for the build version for Vercel
        // if (reservationDate - presentDate < 0) {
          return next({ status: 400, message: `Reservation date and time must be for a future date.`})
        }
    
        // validation if reservation is on a tuesday
        if (reservationDate.getDay() === 2) {
          return next({ status: 400, message: `Our restaurant is closed on Tuesday to allow the employees time to rest and enjoy their day.`})
        }
    
        // validation if reservation is not during open hours
        const reservationTime = reservation_time;  
        if (reservationTime < '10:30') {
          return next({ status: 400, message: `The restaurant does not open until 10:30 AM.`})
        }
    
        if (reservationTime > '21:30:00') {
          return next({ status: 400, message: `Please make a reservation at least 1 hour prior to closing. The restaurant closes at 10:30 PM.`})
        }
        next();
    }
}

module.exports = reservationTimeValidator;