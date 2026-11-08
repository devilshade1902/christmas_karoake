import React, { useContext, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      // Sync user state when localStorage changes
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) logout();
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      // Clean up listener on unmount
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  return (
    <div
      style={{
        backgroundColor: '#8b0000',
        padding: '15px',
        fontFamily: "'Cinzel', serif",
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
      className="navbar-custom"
    >
      <div style={{ textAlign: 'center', color: '#fff', fontSize: '1.5em' }}>
        <Link
          to="/"
          style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}
          className="navbar-brand-custom"
        >
          Karaoke Fest 🎄
        </Link>
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
        className="navbar-links"
      >
        <Link
          to="/"
          style={{
            color: '#fff',
            textDecoration: 'none',
            margin: '0 15px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ffd700')}
          onMouseOut={(e) => (e.target.style.color = '#fff')}
        >
          Home
        </Link>
        <Link
          to="/songs"
          style={{
            color: '#fff',
            textDecoration: 'none',
            margin: '0 15px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ffd700')}
          onMouseOut={(e) => (e.target.style.color = '#fff')}
        >
          Songs
        </Link>
        <Link
          to="/gallery"
          style={{
            color: '#fff',
            textDecoration: 'none',
            margin: '0 15px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ffd700')}
          onMouseOut={(e) => (e.target.style.color = '#fff')}
        >
          Gallery
        </Link>
        <Link
          to="/leaderboard"
          style={{
            color: '#fff',
            textDecoration: 'none',
            margin: '0 15px',
            fontSize: '1.2em',
            fontWeight: 'bold',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ffd700')}
          onMouseOut={(e) => (e.target.style.color = '#fff')}
        >
          Leaderboard
        </Link>

        {user ? (
          <>
            <span
              style={{
                color: '#ffd700',
                margin: '0 15px',
                fontSize: '1.2em',
                fontWeight: 'bold',
              }}
            >
              Welcome, {user.name}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              style={{
                backgroundColor: '#ffd700',
                color: '#8b0000',
                border: 'none',
                padding: '8px 15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#ffbf00')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#ffd700')}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn btn-primary m-3">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-dark">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
