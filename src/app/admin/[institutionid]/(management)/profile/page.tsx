import React from "react";

export default function ProfilePage() {
  return (
    <div className="p-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <span className="text-gray-500">Dashboard / Profile</span>
      </div>

      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-6">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">Danish Heilium</h2>
              <p className="text-gray-600">Ui/Ux Designer</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex space-x-6">
              <div>
                <span className="text-gray-500">259 Posts</span>
              </div>
              <div>
                <span className="text-gray-500">129K Followers</span>
              </div>
              <div>
                <span className="text-gray-500">2K Following</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold">About Me</h3>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque posuere fermentum urna, eu condimentum mauris tempus
              ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
              ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
              pharetra ligula sed, aliquam lacus.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold">Follow me on</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-blue-500">
                Twitter
              </a>
              <a href="#" className="text-blue-500">
                LinkedIn
              </a>
              <a href="#" className="text-blue-500">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
