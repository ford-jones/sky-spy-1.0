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
    window.addEventListener('load', onLoad)
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

      setTimeout(() => {
        location !== null && geofence !== null ? setLoading(false) : null
      }, 5000)
    })
  }, [location])

  function onLoad(e) {
    e.preventDefault()
    if (data.length < 1) {
      function fetchFlightData(method, params) {
        const api_key = `${process.env.AIR_LABS_API_KEY2}`
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

    const nearby = data.filter((flightLocation) => {
      return(
      flightLocation.lat < geofence.north &&
      flightLocation.lat > geofence.south &&
      flightLocation.lng < geofence.east &&
      flightLocation.lng > geofence.west &&
      flightLocation.status === 'en-route'
      )
  })
  
    nearby.map((flight) => {
      if (
        flight.arr_iata && flight.dep_iata 
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
        <span>Track commercial airlines you see in the sky in real time!</span>
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
