import React, { useState } from "react";
import { auth } from "../firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const NeomorphicInput = ({ id, name, type, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required
      className="appearance-none relative block w-full px-3 py-2 border-none text-white placeholder-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-indigo-600 shadow-[inset_3px_3px_5px_#383b8b,inset_-3px_-3px_5px_#5f63f0]"
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
    <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-200 to-indigo-600 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Change Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handlePasswordChange}>
          <div className="rounded-md shadow-sm">
            <NeomorphicInput
              id="current-password"
              name="currentPassword"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <NeomorphicInput
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <NeomorphicInput
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-300 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-300 text-sm text-center">{success}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-[3px_3px_5px_#383b8b,-3px_-3px_5px_#5f63f0] transition duration-300 ease-in-out hover:shadow-[inset_3px_3px_5px_#383b8b,inset_-3px_-3px_5px_#5f63f0]"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
