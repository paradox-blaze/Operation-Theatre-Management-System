import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../services/auth';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavLinks = () => {
        if (!user) return [];

        // Group related links together
        const links = [
            // Core Operations
            { to: '/', label: 'Home', roles: ['admin', 'surgeon', 'staff'], group: 'core' },
            { to: '/theatre', label: 'Theatre', roles: ['admin', 'surgeon'], group: 'core' },
            { to: '/surgeries', label: 'Surgeries', roles: ['admin', 'surgeon'], group: 'core' },
            { to: '/op_records', label: 'OP Records', roles: ['admin', 'surgeon', 'staff'], group: 'core' },

            // Patient Management
            { to: '/patient', label: 'Patients', roles: ['admin', 'surgeon'], group: 'management' },
            { to: '/schedule', label: 'Schedule', roles: ['admin', 'staff'], group: 'management' },

            // Resources
            { to: '/equipment', label: 'Equipment', roles: ['admin', 'staff'], group: 'resources' },
            { to: '/billing', label: 'Billing', roles: ['admin', 'staff'], group: 'resources' },

            // Administration
            { to: '/staff', label: 'Staff', roles: ['admin'], group: 'admin' },
            { to: '/surgeon', label: 'Surgeons', roles: ['admin'], group: 'admin' },
        ];

        return links.filter(link => link.roles.includes(user.role));
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">OT Management</span>
                    </div>

                    {/* Main Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                />
                            </svg>
                        </button>
                    </div>

                    {/* User Info & Logout */}
                    {user && (
                        <div className="hidden lg:flex lg:items-center lg:ml-6">
                            <span className="text-gray-300 text-sm">
                                Welcome, {user.username} ({user.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {user && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium mt-2"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;