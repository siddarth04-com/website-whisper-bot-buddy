
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Website</h1>
        <p className="text-xl text-gray-600 mb-8">
          We're excited to have you here! Explore our content and feel free to use the chat
          assistant if you need any help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Our Services</h2>
            <p className="text-gray-600">
              Discover our range of high-quality services tailored to meet your needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">About Us</h2>
            <p className="text-gray-600">
              Learn about our mission, vision, and the dedicated team behind our company.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-gray-600">
              Reach out to us for inquiries, support, or to schedule a consultation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
