import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from './Loader'
import Flights from './Flights'

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataReady, setDataReady] = useState(false)
  const [local, setLocal] = useState([])
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
  })
  const [geofence, setGeofence] = useState({
    north: null,
    east: null,
    south: null,
    west: null,
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lon: position.coords.longitude,
        lat: position.coords.latitude,
      })
      if (location != null) {
        setGeofence({
          north: location.lat + 0.5,
          east: location.lon + 0.5,
          south: location.lat - 0.5,
          west: location.lon - 0.5,
        })
      }

      window.addEventListener('load', onLoad)

      setTimeout(() => {
        location !== null && geofence !== null ? setLoading(false) : null
      }, 5000)
    })
  }, [location])

  function onLoad(e) {
    e.preventDefault()
    if (data.length < 1) {
      function fetchFlightData(method, params) {
        const api_key = `${process.env.AIR_LABS_API_KEY}`
        params.api_key = api_key

        axios
          .get(`https://airlabs.co/api/v9/${method}`, { params })
          .then((res) => {
            setData(res.data.response)
            return null
          })
          .catch((err) => {
            console.trace()
            console.error(err)
          })
      }
      fetchFlightData('flights', { param1: 'value1' })
    }
  }

  function handleClick(e) {
    e.preventDefault()

    const depAkl = data.filter((x) => {
      return x.dep_iata === 'AKL'
    })

    const arrAkl = data.filter((x) => {
      return x.arr_iata === 'AKL'
    })

    const nearby = depAkl.concat(arrAkl)

    nearby.map((flight) => {
      if (
        flight.lat < geofence.north &&
        flight.lat > geofence.south &&
        flight.lng < geofence.east &&
        flight.lng > geofence.west &&
        flight.status === 'en-route'
      ) {
        setLocal(local.push(flight))
        const setFlights = JSON.stringify(local)
        localStorage.setItem('flights', setFlights)
      }
    })

    const getFlights = JSON.parse(localStorage.getItem('flights'))
    getFlights ? setDataReady(true) : null
  }

  return (
    <>
      <div className="main">
        <img src="./images/home.png" alt="plane_image" />
        <h1>Sky Spy 1.0.0</h1>
        {loading ? (
          <Loader />
        ) : (
          <>
            {dataReady ? (
              <Flights location={location} />
            ) : (
              <button type="submit" onClick={handleClick}>
                get flight data
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}

//  Dummy data:

// [{
//  aircraft_icao: "B789"
//  airline_iata: "CZ"
//  airline_icao: "CSN"
//  alt: 10965
//  arr_iata: "CAN"
//  arr_icao: "ZGGG"
//  dep_iata: "AKL"
//  dep_icao: "NZAA"
//  dir: 322
//  flag: "CN"
//  flight_iata: "CZ306"
//  flight_icao: "CSN306"
//  flight_number: "306"
//  hex: "781360"
//  lat: -12.041582
//  lng: 141.385223
//  reg_number: "B-1242"
//  speed: 857
//  squawk: "0234"
//  status: "en-route"
//  updated: 1681832020
//  v_speed: 0.3
// },
// {
//  aircraft_icao: "B738"
//  airline_iata: "QF"
//  airline_icao: "QFA"
//  alt: 0
//  arr_iata: "MEL"
//  arr_icao: "YMML"
//  dep_iata: "AKL"
//  dep_icao: "NZAA"
//  dir: 253
//  flag: "AU"
//  flight_iata: "QF158"
//  flight_icao: "QFA158"
//  flight_number: "158"
//  hex: "7C77F4"
//  lat: -37.667732
//  lng: 144.847244
//  reg_number: "VH-XZA"
//  speed: 3
//  squawk: "0240"
//  status: "landed"
//  updated: 1681831989
// },
// {
// aircraft_icao: "B733"
// airline_icao: "AWK"
// alt: 11277
// arr_iata: "AKL"
// arr_icao: "NZAA"
// dep_iata: "MEL"
// dep_icao: "YMML"
// dir: 58
// flag: "NZ"
// flight_icao: "AWK5"
// flight_number: "5"
// hex: "C81E1C"
// lat: -31.486025
// lng: 156.483658
// reg_number: "ZK-TLE"
// speed: 768
// squawk: "1507"
// status: "en-route"
// updated: 1681831514
// v_speed: 0.3
// }
// ]

//

// geofence: {north: -36.3646739, east: 175.2493547, south: -37.3646739, west: 174.2493547}
