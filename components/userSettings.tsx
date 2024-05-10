import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { input } from "@material-tailwind/react";

function socialLink(key: number, val: string, handler: (k: number, v: string) => void): React.JSX.Element {
  return (
    <input
      name={"social-" + val}
      type="text"
      key={String(key)}
      value={val}
      className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
      onChange={(e) => { handler(key, e.target.value); }}
    />
  )
}

export function UserSettings() {
  const [formData, setFormData] = useState({ email: '', password: '', socials: [{ id: 0, value: "" }] });
  const [validationMsg, setValidationMsg] = useState({ email: '', password: '' });
  const router = useRouter();
  const { data: session, status } = useSession();
  if (session == undefined) {
    return <h1>User is not logged in</h1>
  }
  const username = session.user.name;
  if (username == undefined) {
    return <h1>User session is corrupted</h1>
  }

  let oldMail = session.user.email ?? "";

  // social media links



  const validateInput = (name: string, value: string) => {
    let msg = '';
    if (value.trim() === '') {
      msg = 'This field is required';
    } else {
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        msg = 'Please enter a valid email address';
      }
    }
    setValidationMsg({ ...validationMsg, [name]: msg });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateInput(name, value);
  };

  const handleSocialChange = (key: number, value: string) => {
    // update states
    const newSocials = formData.socials.map((v, _) => {
      if (v.id == key) {
        v.value = value
        return v
      }
      return v
    })
    setFormData({ ...formData, ['socials']: newSocials });

    // check if there is a need for a new input
    if (value != '') {


      if (key >= formData.socials.length - 1) {
        // add new to bottom
        const newSocials = formData.socials.concat({ id: (key + 1), value: "" })
        setFormData({ ...formData, ['socials']: newSocials });
      }
    }
  };

  const handleDelete = () => {

  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Check if there are any validation messages
    const isFormValid = Object.values(validationMsg).every(msg => msg === '');
    if (!isFormValid) {
      alert('Please fix the validation errors');
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User edit successfully');
        router.push(`/user`);
      } else {
        alert(`Edit failed: ${data.message}`);
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
              Edit your Account
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label htmlFor="profile-picture" className="mb-2 block text-lg">Profile Picture</label>
                <input type="file" name="profile-picture" />
                <label htmlFor="username" className="mb-2 block text-lg dark:text-gray-400">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  disabled
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 bg-blue-gray-400 dark:border-gray-700"
                  value={username}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-lg dark:text-gray-400">
                  Email
                </label>
                <input
                  name="email"
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={oldMail}
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
                  className="w-full rounded-lg border border-gray-300 p-3 shadow-md placeholder:text-base focus:scale-105 duration-300 ease-in-out dark:bg-indigo-700 dark:border-gray-700 dark:text-gray-300"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {validationMsg.password && <div className="text-red-500">{validationMsg.password}</div>}
              </div>
              <label className="mb-2 block text-lg dark:text-gray-400">
                Social Links
              </label>

              {formData.socials.map(val => {
                return socialLink(val.id, val.value, handleSocialChange)
              })}

              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2 mt-8 text-white shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              >
                Save Changes
              </button>
            </form>

            <form onSubmit={handleDelete} method="get">
              <button type="submit"
                className="w-full rounded-lg bg-red-500  p-2 mt-8 text-white shadow-lg hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
              >DELETE USER</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
