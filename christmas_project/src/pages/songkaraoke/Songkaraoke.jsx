import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Songkaraoke.css";

const Songkaraoke = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [timings, setTimings] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await fetch(`http://localhost:4000/song/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch song");
        }
        const data = await response.json();
        setSong(data);
        setTimings(data.lyrics_timings || []);
      } catch (error) {
        console.error("Error fetching song:", error);
      }
    };
    fetchSong();
  }, [id]);

  const syncLyrics = () => {
    const audio = audioRef.current;
    if (!audio || !timings.length) return;
  
    const currentTime = audio.currentTime;
    console.log("Current Time:", currentTime); // Debugging
    console.log("Timings:", timings); // Debugging
    
    // Find the index of the current line based on timings
    const newLine = timings.findIndex(
      (time, index) =>
        currentTime >= time &&
        (index === timings.length - 1 || currentTime < timings[index + 1])
    );
  
    if (newLine !== -1 && newLine !== currentLine) {
      setCurrentLine(newLine);
  
      const container = lyricsContainerRef.current;
      if (container) {
        const lineElement = container.children[newLine];
        if (lineElement) {
          container.scrollTo({
            top: lineElement.offsetTop - container.offsetTop,
            behavior: "smooth",
          });
        }
      }
    }
  };
  
  
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", syncLyrics);
    audio.addEventListener("seeked", syncLyrics);

    return () => {
      audio.removeEventListener("timeupdate", syncLyrics);
      audio.removeEventListener("seeked", syncLyrics);
    };
  }, [currentLine, timings]);

  const handleStartRecording = async () => {
    try {
      const audioElement = audioRef.current;
  
      if (!isRecording) {
        // Request microphone input
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
  
        // Create source nodes for the microphone and song
        const micSource = audioContext.createMediaStreamSource(micStream);
        const songSource = audioContext.createMediaElementSource(audioElement);
  
        // Create GainNodes for both microphone and song
        const micGain = audioContext.createGain();
        const songGain = audioContext.createGain();
  
        // Set gain values
        micGain.gain.value = 2.0; // Amplify microphone audio (2x volume)
        songGain.gain.value = 0.3; // Reduce song volume (10% volume)
  
        // Create a destination node to mix both audio streams
        const destination = audioContext.createMediaStreamDestination();
  
        // Connect microphone and song sources to their respective GainNodes
        micSource.connect(micGain).connect(destination);
        songSource.connect(songGain).connect(destination);
        songSource.connect(audioContext.destination); // Play through speakers
  
        // Create a MediaStream that includes both audio streams
        const mixedStream = destination.stream;
  
        // Add video (optional)
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream.getTracks().forEach((track) => mixedStream.addTrack(track));
  
        setStream(mixedStream);
  
        // Initialize MediaRecorder with the mixed stream
        const recorder = new MediaRecorder(mixedStream);
        setMediaRecorder(recorder);
  
        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          setMediaBlobUrl(URL.createObjectURL(blob));
        };
  
        recorder.start();
        setIsRecording(true);
  
        // Play the song (if not already playing)
        if (audioElement && audioElement.paused) {
          await audioElement.play();
        }
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  
  
  
  
  
  const handleStopRecording = () => {
    const audio = audioRef.current;
  
    // Pause the audio
    if (audio) {
      audio.pause();
    }
  
    // Stop the recording
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  
    // Stop the media stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  
    setIsRecording(false);
  };
  

  const handleSaveRecording = () => {
    if (mediaBlobUrl) {
      const link = document.createElement("a");
      link.href = mediaBlobUrl;
      link.download = "karaoke-session.webm";
      link.click();
    }
  };

  if (!song) {
    return <div>Loading song data...</div>;
  }

  const lyrics = Array.isArray(song.lyrics) ? song.lyrics : JSON.parse(song.lyrics);

  return (
    <div className="songkaraoke-container">
      <h1 className="song-title">{song.title}</h1>

      <div className="lyrics-container" ref={lyricsContainerRef}>
        {console.log(timings)}
        {lyrics.map((line, index) => (
          <p
            key={index}
            className={currentLine === index ? "current-line" : "line"}
          >
            {line}
          </p>
        ))}
      </div>

      <audio ref={audioRef} preload="auto" controls crossOrigin="anonymous">
        <source src={song.file_url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="recording-controls">
        <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {mediaBlobUrl && (
          <div className="video-preview">
            <video src={mediaBlobUrl} controls autoPlay />
            <button onClick={handleSaveRecording}>Save Recording</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Songkaraoke;
