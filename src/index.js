import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAEusYupt8ifrJOawA2dOFza1NbOwJsr3Q',
  authDomain: 'remove-spaces.firebaseapp.com',
  projectId: 'remove-spaces',
  storageBucket: 'remove-spaces.appspot.com',
  messagingSenderId: '564020451201',
  appId: '1:564020451201:web:e6b133a28f1d77d6c5fa80',
  measurementId: 'G-JCWCKZDH6C',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
