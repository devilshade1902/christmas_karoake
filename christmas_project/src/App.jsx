import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import Songs from './pages/songs/Songs';
import Leaderboard from './pages/leaderboard/Leaderboard';
import Gallery from './pages/gallery/Gallery';
import Songkaraoke from './pages/songkaraoke/Songkaraoke';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';

// Create a context for the user
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/song" element={<Songkaraoke />}>
            <Route path=":id" element={<Songkaraoke />} />
          </Route>
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
