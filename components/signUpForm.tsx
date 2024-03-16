import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export function SignUpForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [validationMsg, setValidationMsg] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const validateInput = (name: string, value: string) => {
    let msg = '';
    if (value.trim() === '') {
      msg = 'This field is required';
    } else {
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        msg = 'Please enter a valid email address';
      } else if (name === 'password' && value.length < 8) {
        msg = 'Password must be at least 8 characters';
      }
    }
    setValidationMsg({ ...validationMsg, [name]: msg });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateInput(name, value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
  
    // Check if there are any validation messages
    const isFormValid = Object.values(validationMsg).every(msg => msg === '');
    if (!isFormValid) {
      alert('Please fix the validation errors');
      return;
    }
  
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('User registered successfully');
        router.push(`/signin`);
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      alert('An error occurred while submitting the form');
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-purple-50">
      <div className="grid gap-8 w-full max-w-xl p-4">
        <div className="m-4 rounded-[26px] bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="m-2 rounded-[20px] border-[20px] border-transparent bg-white p-10 shadow-lg dark:bg-gray-900">
            <h1 className="cursor-default text-center text-3xl font-bold pb-6 text-gray-400 dark:text-gray-400">
              Create your Account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-2 block text-lg dark:text-gray-400">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
                {validationMsg.username && <div className="text-red-500">{validationMsg.username}</div>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-lg dark:text-gray-400">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                {validationMsg.email && <div className="text-red-500">{validationMsg.email}</div>}
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-lg dark:text-gray-400">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {validationMsg.password && <div className="text-red-500">{validationMsg.password}</div>}
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2 mt-8 text-white shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              >
                SIGN UP
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-400 transition-all duration-100 ease-in-out">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
