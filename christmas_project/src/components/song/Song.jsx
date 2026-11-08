import React from 'react'
import './song.css'
import { Link } from 'react-router'

const Song = (props) => {
  return (
    <Link to={`/song/${props.id}`}>
      <div className='song-container'>
        <img src={props.thumbnail} alt="" />
        <p>{props.title}</p>
        <button className='btn'>Sing Now</button>
      </div>
    </Link>
  )
}

export default Song
