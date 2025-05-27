import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login Logic
        const response = await axios.post('http://localhost:8080/api/auth/signin', {
          username,
          password
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setMessage('Login successful!');
        navigate('/trips');
      } else {
        // Register Logic
        await axios.post('http://localhost:8080/api/auth/signup', {
          username,
          email,
          password,
          role: ['user']
        });
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>{isLogin ? 'Login' : 'Register'}</h3>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>
              
              <div className="mt-3 text-center">
                <button 
                  className="btn btn-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;