import React, { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Later replace this with an API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
          Sign Up
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded hover:bg-purple-800"
        >
          Register
        </button>
      </form>
    </div>
  );
}
