// unsure how below line even got imported...
// const { next } = require('../../../front-end/src/utils/date-time');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const mergeSort = require('../utils/mergeSort');
const reservationFormatValidator = require('../utils/reservationFormatValidator');
const hasProperties = require('../errors/hasProperties');
const compareByReservationTime = require('../utils/compareByReservationTime');

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

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

// const VALID_PROPERTIES = [...REQUIRED_PROPERTIES];

// function onlyHasValidProperties(req, res, next) {
//   const { data = {} } = req.body;

//   const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));

//   if(invalidFields.length) {
//     return next({
//       status: 400,
//       message: `Request body contains invalid field(s): ${invalidFields.join(', ')}.`
//     })
//   }
//   res.locals.data = data;
//   next();
// }





// function compareReservationsByTime(left, right) {
//   const leftDate = left.reservation_date;
//   const [leftYear, leftMonth, leftDay] = [leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate()]
//   const leftTimeArray = left.reservation_time.split(':');
//   const leftTime = new Date(leftYear, leftMonth, leftDay, ...leftTimeArray)

//   const rightDate = right.reservation_date;
//   const [rightYear, rightMonth, rightDay] = [rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate()]
//   const rightTimeArray = right.reservation_time.split(':');
//   const rightTime = new Date(rightYear, rightMonth, rightDay, ...rightTimeArray)

//   return leftTime.getTime() - rightTime.getTime();
// }

async function list(req, res) {
  const { date } = req.query;
  if (date) {
    const data = await service.readByDate(date)
    // const sortedData = data.sort((reservationA, reservationB) => reservationA.reservation_time - reservationB.reservation_time);
    const sortedData = mergeSort(compareByReservationTime, data);
    res.json({ data: sortedData })
  } else {
    const data = await service.list();
    const sortedData = mergeSort(compareByReservationTime, data);
    // const sortedData = data.sort((reservationA, reservationB) => parseInt(reservationA.reservation_time.split(':')) - parseInt(reservationB.reservation_time.split(':')));
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

async function read(req, res, next) {
  const reservationId = parseInt(req.params.reservationId);
  const reservationFound = await service.read(reservationId);
  if (!reservationFound) return next({ status: 404, message: `Cannot find reservation with ID ${reservationId}.` })
  res.status(200).json({ data: reservationFound })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredProperties, reservationFormatValidator(), asyncErrorBoundary(create)],
  delete: asyncErrorBoundary(destroy),
  read,
};