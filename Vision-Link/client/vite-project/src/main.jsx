import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext';
import { CookiesProvider } from 'react-cookie';
import { SocketContextProvider } from './context/SocketContext';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')); // Updated usage

root.render(
  <BrowserRouter>
    <CookiesProvider>
      <AuthContextProvider>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </AuthContextProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
