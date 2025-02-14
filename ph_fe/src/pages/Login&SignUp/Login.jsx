import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
export default function Login() {
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"

            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden rounded">
            <div className="grid md:grid-cols-2">
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-10 text-left">Login</h1>
                {/* Form */}
                <form className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">Email address</label>
                    <input
                      type="email"
                      className="w-full p-2 bg-gray-100 border rounded"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">Password</label>
                    <input
                      type="password"
                      className="w-full p-2 bg-gray-100 border rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    {/* Remember account */}
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="ml-4" />
                      <span>Remember account</span>
                    </label>
                    {/* Forgot password */}
                    <a href="#" className="text-blue-500 underline font-semibold">
                      Forgot password
                    </a>
                  </div>

                  {/* Submit Form */}
                  <button className="w-2/5 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                    Sign in
                  </button>
                </form>

                <p className="mt-4 text-sm text-center">
                  Don't have an account?{' '}
                  <Link to="/SignUp" className="text-blue-500 underline">
                    Sign up
                  </Link>
                </p>

                <div className="text-left mt-8">
                  <Link to="/" className="flex text-gray-400 hover:text-gray-500">
                    Home page
                  </Link>
                </div>
              </div>

              <div className=" p-8 flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dyv5p6rpf/image/upload/v1737568026/cute-mascot_fkjwgv.png"
                  alt="Cute mascot"
                  className="w-fit h-fit rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  );
}