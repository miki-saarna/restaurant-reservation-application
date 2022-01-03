// unsure how below line even got imported...
// const { next } = require('../../../front-end/src/utils/date-time');
const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const mergeSort = require('../utils/sorting/mergeSort');
const reservationFormatValidator = require('../utils/validators/reservationFormatValidator');
const hasProperties = require('../errors/hasProperties');
const { compareByReservationTime } = require('../utils/sorting/compare');
const reservationBodyValidator = require('../utils/validators/reservationBodyValidator');

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

// is there a difference between using this method and simplifying this by removing the try/catch?
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  try {
    const reservationFound = await service.read(reservationId)
    if (!reservationFound) {
      const error = new Error(`Cannot find reservation with ID: '${reservationId}'.`)
      error.status = 404;
      throw error;
    }
    res.locals.reservationId = reservationId;
    res.locals.reservationFound = reservationFound;
    next();
  } catch(error) {
    next(error);
  } 
}


async function list(req, res) {
  const { reservation_id, date, mobile_number } = req.query;
  if (reservation_id) {
    const data = await service.readByReservationId(reservation_id)
    res.json({ data })
  } else if (date) {
    const data = await service.readByDate(date)
    res.json({ data })

  } else if (mobile_number) {
    const data = await service.readByNumber(mobile_number);
    res.json({ data })
  } else {
    const data = await service.list();
    const sortedData = mergeSort(compareByReservationTime, data);
    res.json({ data: sortedData });
  }
}

async function create(req, res, next) {
  const { data } = req.body;
  const newReservation = await service.create(data);
  res.status(201).json({ data: newReservation })
}

async function edit(req, res, next) {
  const { data } = req.body;
  const edittedReservation = await service.edit(data)
  res.json({ data: edittedReservation})
}

async function destroy(req, res) {
  await service.destroy(res.locals.reservationId);
  res.sendStatus(204);
}

async function read(req, res, next) {
  res.status(200).json({ data: res.locals.reservationFound })
}

async function updateStatus(req, res, next) {
  const { reservation_id, status } = res.locals.reservationFound;
  
  // const reservation_id = res.locals.reservationId;
  const newStatus = req.body.data.status;
  if (!['seated', 'booked', 'finished', 'cancelled'].includes(newStatus)) {
    return next({ status: 400, message: `Cannot update to an unknown status.`});
  }

  if (status === 'finished') {
    return next({ status: 400, message: `Cannot update a status that is already "finished".`});
  }

  const data = await service.updateStatus(reservation_id, newStatus);
  res.json({ data })
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredProperties, reservationFormatValidator(), reservationBodyValidator(), asyncErrorBoundary(create)],
  delete: [reservationExists, asyncErrorBoundary(destroy)],
  read: [reservationExists, read],
  update: [reservationExists, asyncErrorBoundary(updateStatus)],
  edit: [reservationExists, hasRequiredProperties, reservationFormatValidator(), reservationBodyValidator(), asyncErrorBoundary(edit)],
};