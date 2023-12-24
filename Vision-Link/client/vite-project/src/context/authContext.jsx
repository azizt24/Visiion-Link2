import axios from 'axios';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const login = async (inputs) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/login', inputs);
      const { token, user } = res.data;

      localStorage.setItem('userToken', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userEmail', user.email);

      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const register = async (inputs) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/register', inputs);
      const { token, user } = res.data;

      localStorage.setItem('userToken', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.username);
      localStorage.setItem('userEmail', user.email);

      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorage.removeItem(key);
      }
    }

    navigate('/');
  };

  return <AuthContext.Provider value={{ login, register, logout }}>{children}</AuthContext.Provider>;
};
