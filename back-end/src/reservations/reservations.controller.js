// unsure how below line even got imported...
// const { next } = require('../../../front-end/src/utils/date-time');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

/**
 * List handler for reservation resources
 */


const REQUIRED_PROPERTIES = [
  'first_name',
  'last_name',
  'mobile_number',
  'reservation_date',
  'reservation_time',
  'people'
]

const VALID_PROPERTIES = [...REQUIRED_PROPERTIES];

function onlyHasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));

  if(invalidFields.length) {
    return next({
      status: 400,
      message: `Request body contains invalid field(s): ${invalidFields.join(', ')}.`
    })
  }
  res.locals.data = data;
  next();
}

function hasRequiredProperties(properties) {
  return function (req, res, next) {
    const data = res.locals.data;
    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  }
}

function properFormat(req, res, next) {
  const { reservation_date, reservation_time, people } = res.locals.data;

  const dateArray = reservation_date.split('-');
  dateArray[1] -= 1;
  const reservationDate = new Date(...dateArray);

  const timeArray = reservation_time.split(':');
  const reservationTime = new Date(...timeArray);

  reservationDate == "Invalid Date" ? next({ status: 400, message: `The 'reservation_date' property must be a date.`}) : null;

  reservationTime == "Invalid Date" ? next({ status: 400, message: `The 'reservation_time' property must be a date.`}) : null;

  typeof people === 'number' ? null : next({ status: 400, message: `The 'people' property must be a number type.`});
  next();
}

async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await service.readByDate(date)
    const sortedData = data.sort((reservationA, reservationB) => reservationA.reservation_time - reservationB.reservation_time);
    res.json({ data: sortedData })
  } else {
    const data = await service.list();
    const sortedData = data.sort((reservationA, reservationB) => parseInt(reservationA.reservation_time.split(':')) - parseInt(reservationB.reservation_time.split(':')));
    res.json({ data: sortedData });
  }
}

async function create(req, res, next) {
  const data = res.locals.data;
  // console.log(data)
  const presentDateUTC = new Date();
  // get timezone offset in ms
  const timezoneOffset = presentDateUTC.getTimezoneOffset() * 60000;
  // get present date/time with timezone consideration
  // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
  const presentDate = new Date(presentDateUTC.getTime() - timezoneOffset);


  // separate year, month, day
  const dateArray = data.reservation_date.split('-')
  // new Date() format requires month index, which is 0 indexed
  dateArray[1] -= 1;
  // separate hour, minute, second
  const timeArray = data.reservation_time.split(':')

  const reservationDateUTC = new Date(...dateArray, ...timeArray);
  // get reservation date/time with timezone consideration
  // use getTime() method to convert to ms, which will allow us to subtract the timezoneOffset
  const reservationDate = new Date(reservationDateUTC.getTime() - timezoneOffset)

  
  // validation if reservation date is in the past
  if (reservationDate - presentDate < 0) {
    return next({ status: 400, message: `Reservation date and time cannot be for a past date. Must be for a future date.`})
  }

  // validation if reservation is on a tuesday
  if (reservationDate.getDay() === 2) {
    return next({ status: 400, message: `Our restaurant is closed on Tuesday to allow the employees time to rest and enjoy their day.`})
  }

  // validation if reservation is not during open hours
  const reservationTime = data.reservation_time;  
  if (reservationTime < '10:30:00') {
    return next({ status: 400, message: `The restaurant does not open until 10:30 AM.`})
  }

  if (reservationTime > '21:30:00') {
    return next({ status: 400, message: `Please make a reservation at least 1 hour prior to closing. The restaurant closes at 10:30 PM.`})
  }
  
  newReservation = await service.create(data);
  res.status(201).json({ data: newReservation })
}

async function destroy(req, res) {
  const reservationId = parseInt(req.params.reservationId);
  await service.destroy(reservationId);
  res.sendStatus(204);
}

async function read(req, res) {
  const reservationId = parseInt(req.params.reservationId);
  const reservationFound = await service.read(reservationId);
  res.status(200).json({ data: reservationFound })
}

module.exports = {
  list,
  create: [onlyHasValidProperties, hasRequiredProperties(REQUIRED_PROPERTIES), properFormat, asyncErrorBoundary(create)],
  delete: destroy,
  read,
};