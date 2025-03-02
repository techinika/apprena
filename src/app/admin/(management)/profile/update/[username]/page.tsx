import React from "react";

export default function UpdateProfile() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Update Profile for</h1>
      <form>
        <input type="text" placeholder="Name" className="border p-2" />
        <input type="email" placeholder="Email" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Update
        </button>
      </form>
    </div>
  );
}
