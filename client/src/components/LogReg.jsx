import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogReg = () => {
  const [register, setRegister] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    register: {},
    login: {}
  });

  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/register', register, {
      withCredentials: true
    })
      .then(res => {
        console.log(res.data);
        setRegister({
          name: '',
          alias: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({ ...errors, register: {} });
        navigate("/bright_ideas");
      })
      .catch(err => {
        console.log("ERROR", err.response);
        const errorData = err.response?.data?.errors || err.response?.data || {};
        setErrors({
          ...errors,
          register: errorData
        });
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/login', login, { withCredentials: true })
      .then(res => {
        console.log(res.data);
        setErrors({ ...errors, login: {} });
        navigate("/bright_ideas");
      })
      .catch(err => {
        console.log("ERROR", err.response);
        const errorData = err.response?.data?.errors || err.response?.data || {};
        setErrors({
          ...errors,
          login: errorData
        });
      });
  };

  return (
    <div className='container'>
      <div className="row mt-3">
        <div className="register col bg-light">
          <h2>Register</h2>
          <form onSubmit={handleRegisterSubmit}>
            {errors.register && typeof errors.register === 'object' &&
              Object.values(errors.register).map((err, idx) =>
                err && <p key={idx} style={{ color: "red" }}>{err.message || err}</p>
              )}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" type='text' name='name' value={register.name} onChange={handleRegisterChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Alias</label>
              <input className="form-control" type='text' name='alias' value={register.alias} onChange={handleRegisterChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type='email' name='email' value={register.email} onChange={handleRegisterChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type='password' name='password' value={register.password} onChange={handleRegisterChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input className="form-control" type='password' name='confirmPassword' value={register.confirmPassword} onChange={handleRegisterChange} />
            </div>
            <button type='submit' className='btn btn-primary'>Register</button>
          </form>
        </div>

        <div className="col-3"></div>

        <div className="login col bg-light">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            {errors.login && typeof errors.login === 'object' &&
              Object.values(errors.login).map((err, idx) =>
                err && <p key={idx} style={{ color: "red" }}>{err.message || err}</p>
              )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" type='email' name='email' value={login.email} onChange={handleLoginChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input className="form-control" type='password' name='password' value={login.password} onChange={handleLoginChange} />
            </div>
            <button type='submit' className='btn btn-primary'>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogReg;
