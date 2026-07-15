import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AdminApp from './AdminApp';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { InquiryModalProvider } from './context/InquiryModalContext';
import './index.css';

const isAdminApp = import.meta.env.VITE_APP_MODE === 'admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {isAdminApp ? (
          <AdminApp />
        ) : (
          <CartProvider>
            <InquiryModalProvider>
              <App />
            </InquiryModalProvider>
          </CartProvider>
        )}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
