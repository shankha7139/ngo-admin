import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LogoLight from '../assets/Logo_light.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email matches the allowed email
      if (user.email !== 'opsingh@admin.com') {
        setError('Unauthorized access. Please contact the administrator.');
        await auth.signOut();
      }
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <img src={LogoLight} alt="Logo" style={styles.logo} />
          <h1 style={styles.adminPanel}>Admin Panel</h1>
        </div>
        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{ ...styles.input, ...styles.inputTop }}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                style={{ ...styles.input, ...styles.inputBottom }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.buttonWrapper}>
            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#5a67d8';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#4c51bf';
                e.currentTarget.style.color = '#e0e5ec';
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c51bf', // Indigo background color
    padding: '12px 16px',
  },
  wrapper: {
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#4c51bf', // Indigo background color
    borderRadius: '20px',
    boxShadow: '9px 9px 16px #383b8b, -9px -9px 16px #5f63f0', // Adjusted shadow colors
    padding: '40px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  logo: {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
  },
  adminPanel: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff', // White text color
    textShadow: '1px 1px 2px #383b8b, -1px -1px 2px #5f63f0', // Adjusted shadow colors
  },
  form: {
    marginTop: '12px',
    spaceY: '24px',
  },
  inputGroup: {
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 'inset 3px 3px 5px #383b8b, inset -3px -3px 5px #5f63f0', // Adjusted shadow colors
    marginBottom: '20px',
    backgroundColor: '#4c51bf', // Indigo background color
  },
  input: {
    appearance: 'none',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    fontSize: '1rem',
    color: '#ffffff', // White text color
    outline: 'none',
    borderRadius: '12px',
    backgroundColor: '#4c51bf', // Indigo background color
    boxShadow: 'inset 3px 3px 5px #383b8b, inset -3px -3px 5px #5f63f0', // Adjusted shadow colors
  },
  inputTop: {
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
  },
  inputBottom: {
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  buttonWrapper: {
    marginTop: '20px',
  },
  button: {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#4c51bf', // Indigo background color
    color: '#e0e5ec', // Light text color
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    border: 'none',
    outline: 'none',
    boxShadow: '3px 3px 5px #383b8b, -3px -3px 5px #5f63f0', // Adjusted shadow colors
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginTop: '8px',
  },
  '@media (max-width: 600px)': {
    wrapper: {
      padding: '20px',
    },
    adminPanel: {
      fontSize: '1.5rem',
    },
    input: {
      padding: '10px 14px',
      fontSize: '0.875rem',
    },
    button: {
      padding: '8px 0',
      fontSize: '0.875rem',
    },
  },
};

export default Login;
