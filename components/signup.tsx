import React, { useState, ChangeEvent, FormEvent } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function RegistrationForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [validationMsg, setValidationMsg] = useState({ username: '', email: '', password: '' });

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
        // Additional logic after successful registration, like redirecting
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      alert('An error occurred while submitting the form');
    }
  };
  
    return (
    <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
            Sign Up
        </Typography>
        {/* <Typography color="gray" className="mt-1 font-normal">
            Nice to meet you! Enter your details to register.
        </Typography> */}
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
            <div className="mb-1 flex flex-col gap-6">
                <Typography variant="h6" color="blue-gray" className="-mb-6">
                    Your Unique Username
                </Typography>
                <Input
                    name="username"
                    placeholder="coolguy123"
                    required
                    onChange={handleChange}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                {validationMsg.username && <div className="text-red-500">{validationMsg.username}</div>}
                <Typography variant="h6" color="blue-gray" className="-mb-6">
                    Your Email
                </Typography>
                <Input
                    name="email"
                    type="email"
                    placeholder="coolguy@boringmail.com"
                    required
                    onChange={handleChange}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                />
                {validationMsg.email && <div className="text-red-500">{validationMsg.email}</div>}

                <Typography variant="h6" color="blue-gray" className="-mb-6">
                    Password
                </Typography>
                <Input
                    name="password"
                    type="password"
                    placeholder="********"
                    required
                    onChange={handleChange}
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                />
                {validationMsg.password && <div className="text-red-500">{validationMsg.password}</div>}
            </div>
            <Button className="mt-6 w-full text-bold text-color-black"  >
                SIGN UP
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
                Already have an account?{" "}
            <a href="/signin" className="font-medium text-gray-900">
                Sign In
            </a>
            </Typography>
        </form>
    </Card>
);
}