import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {

  return (
    <nav>
        <ul>
          <li>
            <Link to="/dashboard" className='wow'>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/search">
              Search
            </Link>
          </li>
          <li>
            <Link to="/reservations/new">
              New Reservation
            </Link>
          </li>
          <li>
            <Link to="/tables/new">
            {/* &nbsp; */}
              New Table
            </Link>
          </li>
        </ul>
    </nav>
  );
}

export default Menu;
