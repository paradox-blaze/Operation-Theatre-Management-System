import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from './services/auth.js';
import Navbar from './components/Navbar';

// Import all components
import Login from './components/Login';
import Home from './components/Home';
import Theatre from './components/Theatre';
import Surgeries from './components/Surgeries';
import Staff from './components/Staff';
import Surgeon from './components/Surgeon';
import Patient from './components/Patient';
import Equipment from './components/Equipment';
import Billing from './components/Billing';
import OperationRecords from './components/OperationRecords';
import Schedule from './components/Schedule';

const PrivateRoute = ({ element: Element, allowedRoles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return Element;
};

const PublicRoute = ({ element: Element }) => {
  const user = getUser();

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return Element;
};

const App = () => {
  const user = getUser();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {user && <Navbar />}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                <PublicRoute element={<Login />} />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute
                  element={<Home />}
                  allowedRoles={['admin', 'surgeon', 'staff']}
                />
              }
            />

            {/* Admin & Surgeon Routes */}
            <Route
              path="/theatre"
              element={
                <PrivateRoute
                  element={<Theatre />}
                  allowedRoles={['admin', 'surgeon']}
                />
              }
            />
            <Route
              path="/surgeries"
              element={
                <PrivateRoute
                  element={<Surgeries />}
                  allowedRoles={['admin', 'surgeon']}
                />
              }
            />
            <Route
              path="/patient"
              element={
                <PrivateRoute
                  element={<Patient />}
                  allowedRoles={['admin', 'surgeon']}
                />
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/staff"
              element={
                <PrivateRoute
                  element={<Staff />}
                  allowedRoles={['admin']}
                />
              }
            />
            <Route
              path="/surgeon"
              element={
                <PrivateRoute
                  element={<Surgeon />}
                  allowedRoles={['admin']}
                />
              }
            />

            {/* Admin & Staff Routes */}
            <Route
              path="/equipment"
              element={
                <PrivateRoute
                  element={<Equipment />}
                  allowedRoles={['admin', 'staff']}
                />
              }
            />
            <Route
              path="/billing"
              element={
                <PrivateRoute
                  element={<Billing />}
                  allowedRoles={['admin', 'staff']}
                />
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute
                  element={<Schedule />}
                  allowedRoles={['admin', 'staff']}
                />
              }
            />

            {/* Route accessible by all roles */}
            <Route
              path="/op_records"
              element={
                <PrivateRoute
                  element={<OperationRecords />}
                  allowedRoles={['admin', 'surgeon', 'staff']}
                />
              }
            />

            {/* Catch all route - redirects to home if logged in, login if not */}
            <Route
              path="*"
              element={
                user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;