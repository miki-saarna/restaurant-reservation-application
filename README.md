
# Restaurant Reservation Application

### Table of Contents

- [Live Application](#live-application)
- [Description](#description)
- [Technologies](#technologies)
- [How To Use](#how-to-use)
- [API Paths](#api-paths)
- [Application Features](#application-features)
- [Version 2.0 (future upgrade)](#version-20)
- [License](#license)
- [Author Info](#author-info)

## Live Application

This application can be viewed here: [restaurant-reservation-application.vercel.app](https://restaurant-reservation-application.vercel.app)

The backend API is currently running here: [restaurant-reservation-application-server.vercel.app](https://restaurant-reservation-application-server.vercel.app)

Both the client and server are hosted on [Vercel](https://vercel.com/) with the SQL Databases hosted by [ElephantSQL](https://www.elephantsql.com/)

## Description

This application provides restaurants with an efficient reservation booking system. The user is able to create reservations and also has the ability to edit, cancel and look-up or search for reservations by phone number. Tables of different capacities can be created, deleted, and assigned to reservations. 


## Technologies

This application's front-end is built on React and styling was added through Vanilla CSS. An API handles all promises necessary to interact with the back-end API database.

The application's back-end is built on Express.js, Knex.js, and PostgreSQL servers utilizing RESTful APIs. Knex queries mapped to CRUD operations interact directly with the PostgreSQL databases.

The Express CORS package is implemented for specified domains to access the back-end API.

- Backend API setup
- Creating RESTful APIs
- Using Express for middleware request and response handling
- Implementing PostgreSQL servers
- Using Knex to configure migrations
- Building and mapping CRUD operations between Knex.js and SQL commands
- Frontend built on React with React router and hooks
- Express CORS package implemented
- Project deployed on Vercel

## How To Use

#### Installation:

1. Fork and clone this repository
2. `cd` into the newly created directory
3. Run `cp ./back-end/.env.sample ./back-end/.env`
4. Update the newly created `.env` file in the `./back-end` directory with the connection URLs to your SQL database instance
5. Run `cp ./front-end/.env.sample ./front-end/.env`
6. The newly created `.env` file in the `./front-end` directory does not need to be editted, unless you wish to connect to the backend at a location other than `http://localhost:5000`
7. On line 19 of the `./back-end/src/app.js` file, alter the value(s) of the `allowedDomains` array to include the location(s) where you plan to run the front-end of the application
8. Run `npm install` to install project dependencies
9. Run `npm start` to start your client and server concurrently

Please reach out for assitance if you are having trouble getting the server to properly run.

## API Paths

| API Path | Function |
| -------- | -------- |
| `/reservations` | GET: retrieve all reservations; POST: create a new reservation |
| `/reservations?date=YYYY-MM-DD` | GET: retrieve reservations for a specified date |
| `/reservations?mobile_number=XXX-XXX-XXXX` | GET: retrieve specific reservation containing a specified `mobile_number` |
| `/reservations?reservation_id=X` | GET: retrieve specific reservation with `reservation_id` of `X` |
| `/reservations/:reservationId` | GET: retrieve specific reservation corresponding to `reservation_id`; PUT: edit reservation with corresponding `reservation_id` |
| `/reservations/:reservationId/status` | PUT: update the status of reservation corresponding to `reservation_id` |
| `/tables` | GET: retrieve all tables; POST: create a new table |
| `/tables/:table_id` | GET: retrieve specific table containing specified `table_id`; DELETE: delete specific table containing specified `table_id` |
| `/tables/:table_id/seat` | PUT: update table upon seat assignment by assigning value of reservation_id; DELETE: update table after table is finished by clearing reservation_id |



## Application Features

The application contains a navigation menu containing 4 different pages:

- Dashboard
- Search page
- Create new reservation
- Create new table

![Dashboard of the restaurant reservation application](./images/dashboard.png)

### Dashboard

The dashboard contains all tables as well as all reservations of a specified date (defaulted to current date). Arrows buttons are available to view reservations of the following or previous day(s). Clicking the "Today" button will return the date to the current date. 

Reservations may also contain buttons on seat assignment, editting, and cancellation. The seat button will direct the user to the seat assignment page. The edit button will direct the user to the edit reservation page. The cancel button allows the user to cancel the reservation and remove from view.

Tables with a "Finished" button are currently occupied. Clicking the finish button will free the table and remove its corresponding reservation from view. Tables that are unoccupied contain an "x" button on the top right that will delete the table. An occupied table cannot be deleted until it is finished.

---

![Search page](./images/search-page.png);

### Search Page

The search page allows the user to search for a reservation by phone number. Upon finding the correct reservation, the user can choose to seat the reservation, edit the reservation, or cancel it. Reservations that have already finished or have been cancelled will also be retrieved by this search. This feature creates an optimized and very efficient experience for the user when a customer calls in to alter or cancel their reservation.

---

![Page with form to create a new reservation](./images/reservation-creation.png)

### Create Reservation Page

This page includes a form element with required inputs for the new reservation. Each submission also includes multiple validators on both the front-end and back-end to ensure a valid reservation is created.

![One of the validation errors on reservation submission](./images/reservation-creation-validation.png)

A successful submission will redirect the user to the `/dashboard?date=YYYY-MM-DD` page, which displays all reservations corresponding to the `reservation_date` of the reservation that was just created. The cancel button will return the user to the previous page.

---

![Page that allow reservation to be editted](./images/edit-reservation.png)

## Edit Reservation

Clicking the "Edit" button found on reservations leads the user to the edit reservation page. This page uses the exact same file as the Create Reservation page due to having many similaries). Any and all fields can be editted, but upon submission, front-end and back-end validation will check for validity of the updated reservation and provide submission errors if any. 

Just like the reservation creation page, upon submission, the user will be redirected to `/dashboard?date=YYYY-MM-DD` corresponding to the `reservation_date` of the editted reservation. The cancel button returns the user to the previous page.

---

![Page with form to create a new table](./images/table-creation.png)

## Table Creation

This page contains a form that allows the user to create a new table. Both front-end and back-end validation check to ensure that the table name and capacity contain valid inputs.

![Validation error occuring upon submission of invalid table](./images/table-creation-validation.png)

A successful submission directs the user to the dashboard page, defaulted to the present date. The cancel button will direct the user to the previous page.

---

![Seat assignment page](./images/seat-assignment.png)

## Seat Assignment

Clicking the "Seat" button found on a "booked" reservation leads the user to the seat assignment page. A selector displays table options with each table's corresponding name followed by its capacity. Upon submission, both front-end and back-end validation check if the selected table's capacity can seat the reservation's size. 

![Validation error occuring on seat assignment page](./images/seat-assignment-validation.png)

The submit button directs the user to the dashboard, defaulted to the current date. The cancel button directs the user to the previous page.

![Reservation assigned to table](./images/reservation-assigned-to-table.png)

The status of a reservation changes to "seated" when it has been assigned to a table. The "Seat", "Edit", and "Cancel" buttons will no longer display on a seated reservation. The status of the corresponding table will change to "Occupied". A "Finish" button will now appear on the occupied table.

## Version 2.0

There are a number of updates for the application planned for the near-future, including consolidating the API calls to the database to use one connection instead of opening a separate connection for each action made on the app, which will help speed up the app significantly. Other features planned for this application include but are not limited to:

- Ability to edit tables
- Ability to customize the dashboard with the logo or name of a restaurant
- Designing a custom floor-plan or layout for a restaurnat's tables that include creating tables of different shapes
- Limiting the number of reservations that can be set in any given time frame, to prevent over-booking
- Designing two layers of users: administrator and normal user. A normal user will have access to create, edit, and delete reservations, but an administrator can also create, edit, and delete tables

Feel free to reach out to me if there are any other features not listed that you would like to request to be added.

## License

MIT License

Copyright (c) [2021] [Miki Saarna]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author Info


- GitHub: [miki-saarna](https://github.com/miki-saarna)
- LinkedIn: [Mikito Saarna](https://www.linkedin.com/in/mikito-saarna/)
- Website: [MikiSaarna.com](https://MikiSaarna.com)

[Back To The Top](#restaurant-reservation-application)
