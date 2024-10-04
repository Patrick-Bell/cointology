import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './components/context/CartContext';
import { FavouriteProvider } from './components/context/FavouriteContext';
import { AuthenticateProvider } from './components/context/AuthenticateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthenticateProvider>
    <FavouriteProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </FavouriteProvider>
    </AuthenticateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
