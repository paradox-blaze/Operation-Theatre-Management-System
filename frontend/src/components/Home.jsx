import React from "react";
import { getUser } from "../services/auth.js";

const Home = () => {
  const user = getUser();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Operation Theatre Management System
      </h1>
      <p className="text-gray-600">
        Logged in as: <span className="font-semibold">{user.username}</span> ({user.role})
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Quick Navigation</h2>
        <p className="text-gray-600">
          Use the navigation bar above to access your authorized sections.
        </p>
      </div>
    </div>
  );
};

export default Home;