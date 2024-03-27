import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { data: session, status } = useSession();

  useEffect(() => {
    // If user is logged in just redirect them to tldraw
    // console.log("session", session, status)
    if (status === "authenticated") {
      // Redirect or perform actions based on the authenticated session
      window.location.href = '/tldraw'; 
    }
  }, [session]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // console.log("sending this info to credentials", username, password)
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      // callbackUrl: '/signin',
      username,
      password,
    });

    // console.log("signin result", result)

    if (result?.error) {
      setError('The username and password combination is incorrect.');
    } else {
      window.location.href = '/signin';
    }
  };



  return (
    <div className="flex h-screen w-screen items-center justify-center bg-purple-50 ">
      <div className="grid gap-8 w-full max-w-xl p-4">
        <div className="m-4 rounded-[26px] bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="m-2 rounded-[20px] border-[20px] border-transparent bg-white p-10 shadow-lg dark:bg-gray-900">
            <h1 className="cursor-default text-center text-3xl font-bold pb-6 text-gray-400 dark:text-gray-400">
              Welcome to Journey!
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-2 block text-lg dark:text-gray-400">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-lg dark:text-gray-400">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              
                { // TODO: Add password reset functionality
                /* <a
                  className="group text-blue-400 transition-all duration-100 ease-in-out "
                  href="#"
                >
                  <span
                    className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                  >
                    Forget your password?
                  </span>
                </a>               */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2 mt-8 text-white shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              >
                LOG IN
              </button>
              {error && <div className="mt-2 text-center text-sm text-red-600">{error}</div>}
            </form>
            <p className="mt-4 text-center text-sm text-gray-300">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 transition-all duration-100 ease-in-out">
                  Sign Up
              </Link>
            </p>
            {/* Add third-party authentication options as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
