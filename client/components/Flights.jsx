import React from 'react'

export default function Flights({ location }) {
  const flights = JSON.parse(localStorage.getItem('flights'))

  const orderedFlights = flights.sort((a, b) => {
    return Math.abs(location.lat - a) - Math.abs(location.lon - b)
  })
  function handleClick(e) {
    e.preventDefault()
    localStorage.removeItem('flights')
    window.location.reload()
  }

  return (
    <>
      <h2>Flying over your location:</h2>
      <div className="textbox">
        {orderedFlights.map((flight) => {
          return (
            <>
              <p>Registration: {flight.reg_number}</p>
              <p>Flight Number: {flight.flight_number}</p>
              <p>Flag: {flight.flag}</p>
              <p>Departed From: {flight.dep_iata}</p>
              <p>Arriving At: {flight.arr_iata}</p>
              <p>Last updated: {new Date(flight.updated).getTime()}</p>
              <div className="break"></div>
            </>
          )
        })}
      </div>
      <button type="submit" onClick={handleClick}>
        Clear Data
      </button>
    </>
  )
}
