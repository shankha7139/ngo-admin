import React, { useState } from "react";
import { auth } from "../firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { Lock, Key, AlertCircle, CheckCircle } from "lucide-react";

const NeomorphicInput = ({ id, name, type, placeholder, value, onChange, icon: Icon }) => (
  <div className="mb-4 relative">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-indigo-400" />
    </div>
    <input
      id={id}
      name={name}
      type={type}
      required
      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white shadow-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccess("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        if (error.code === "auth/wrong-password") {
          setError("Current password is incorrect");
        } else {
          setError("Failed to update password. " + error.message);
        }
      }
    } else {
      setError("No user is currently logged in");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-3xl font-extrabold text-center text-white">
              Change Password
            </h2>
            <p className="mt-2 text-center text-indigo-100">
              Keep your account secure by updating your password frequently!
            </p>
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <form className="space-y-6" onSubmit={handlePasswordChange}>
              <NeomorphicInput
                id="current-password"
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                icon={Lock}
              />
              <NeomorphicInput
                id="new-password"
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Key}
              />
              <NeomorphicInput
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Key}
              />

              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>{success}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;