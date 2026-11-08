import React, { useEffect, useState } from 'react'
// import songs from '../../assets/songs'
import Song from '../../components/song/Song'
import './songs.css'
// import {Link} from 'react-router'

const Songs = () => {
  const [songs,setSongs] = useState([])

  useEffect(()=>{
    fetch('http://localhost:4000/songs')
    .then((response)=>response.json())
    .then((data)=>setSongs(data))
  },[])
  return (
    <div style={{marginTop:'50px', marginBottom:'50px'}}>
      <h1>Christmas Songs</h1>
        <div className='christmas-song'>
          <h1>{songs.song_id}</h1>
            {songs.map((song,i)=>{
              return <Song key={i} id={song.song_id}title={song.title} lyrics={song.lyrics} thumbnail = {song.thumbnail}/>
            })}
        </div>
    </div>
  )
}

export default Songs
