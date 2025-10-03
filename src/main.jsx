import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './lib/auth.jsx';
import { ThemeProvider } from './lib/themeProvider.jsx';
import { UIProvider } from './lib/uiProvider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <UIProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </UIProvider>
  </ThemeProvider>
);

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}


