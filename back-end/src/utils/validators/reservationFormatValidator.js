function reservationFormatValidator() {
  return function(req, res, next) {
    const { reservation_date, reservation_time, people, status } = req.body.data;
    try {
      const dateArray = reservation_date.split('-');
      dateArray[1] -= 1;
      const reservationDate = new Date(...dateArray);

      if (reservationDate == "Invalid Date") {
        const error = new Error(`The 'reservation_date' property must be a date.`)
        error.status = 400;
        throw error;
      } 

      const timeArray = reservation_time.split(':');
      const reservationTime = new Date(...timeArray);
    
      if (reservationTime == "Invalid Date") {
        const error = new Error(`The 'reservation_time' property must be a date.`);
        error.status = 400;
        throw error;
      } 
    
      if (typeof people !== 'number') {
        const error = new Error(`The 'people' property must be a number type.`)
        error.status = 400;
        throw error;
      } 

      if (status === 'seated' || status === 'finished') {
        const error = new Error(`Upon creation, status of a reservation must be "booked" instead of "seated" or "finished".`)
        error.status = 400;
        throw error;
      }
      next();
    } catch(error) {
      next(error)
    }
  }
} 

module.exports = reservationFormatValidator;