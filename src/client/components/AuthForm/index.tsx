import React, { useCallback, useState } from "react";
import { InputField } from "../InputField";

type UserFormData = {
  email?: string;
  password?: string;
  isVendor?: false;
};

export default function AuthForm() {
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [userFormData, setUserFormData] = useState<UserFormData>({});

  const updateFormData = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(key)
      setUserFormData({ ...userFormData, [key]: e.target.value });
    },
    [userFormData, setUserFormData]
  );

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLoginForm ? "Sign in to your account" : "Create a new account"}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <InputField
                name="email"
                label="Email address"
                value={userFormData.email}
                type="email"
                onChange={updateFormData("email")}
                required={true}
                autoComplete={"email"}
              />
              <InputField
                name="password"
                label="Password"
                value={userFormData.password}
                type="passowrd"
                onChange={updateFormData("password")}
                required={true}
                autoComplete={"current-password"}
              />

              {!isLoginForm && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="vendor"
                      name="vendor"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      I am a vendor
                    </label>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoginForm ? "Sign in" : "Sign up"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLoginForm
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-sm">
                  <a
                    onClick={(e) => setIsLoginForm(!isLoginForm)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {isLoginForm ? "Sign up" : "Sign in"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
