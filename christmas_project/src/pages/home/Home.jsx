import React from 'react'
import './home.css'
import { Link } from 'react-router'

const Home = () => {
  return (
    <div className="home-container text-center">
      <h1 className="home-title">Welcome to Karaoke Fest 🎤</h1>
      <p className="home-description">
        Sing your heart out, record your performance, and vote for your favorites!
      </p>
      <Link to='/songs' className="home-button" variant="primary" href="/songs">Start Karaoke</Link>
    </div>
  )
}

export default Home
