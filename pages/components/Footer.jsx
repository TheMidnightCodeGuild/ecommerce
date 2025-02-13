import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-5 border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <img
              src="/path/to/souldout-logo.png"
              alt="Logo"
              className="w-32 mb-4"
            />
            <p className="text-sm mb-4">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis enim velit mollit.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-800 hover:text-gray-600">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-800 hover:text-gray-600">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">COMPANY</h3>
            <ul className="space-y-2">
              {["About", "Features", "Works", "Career"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">HELP</h3>
            <ul className="space-y-2">
              {[
                "Customer Support",
                "Delivery Details",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">
              SUBSCRIBE TO NEWSLETTER
            </h3>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm">&copy; Copyright 2024, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
