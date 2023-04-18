import React from 'react'

export default function Loader() {
  return (
    <>
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p id="loaderText">Scanning local airspace...</p>
    </>
  )
}
