import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaUser, FaHeart, FaShoppingBag, FaBars } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { auth } from "@/lib/firebase";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState("0px");
  const [menuOpacity, setMenuOpacity] = useState(0);

  useEffect(() => {
    if (isMenuOpen) {
      setMenuHeight("auto");
      setMenuOpacity(1);
    } else {
      setMenuHeight("0px");
      setMenuOpacity(0);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm w-full z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <nav className="hidden lg:block">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-black hover:text-gray-600 transition-colors">
                  Shop by category
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-sm text-black hover:text-gray-600 transition-colors">
                  Shop by collection
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/" className="text-2xl font-bold text-black">
            Logo
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="w-96">
              <SearchBar />
            </div>
            <Link
              href="/account"
              className="text-gray-600 hover:text-gray-800 transition-colors">
              <FaUser size={20} />
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-gray-800 transition-colors">
              <FaHeart size={20} />
            </Link>
            <Link
              href="/cart"
              className="text-gray-600 hover:text-gray-800 transition-colors">
              <FaShoppingBag size={20} />
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <button
            className="lg:hidden text-black"
            onClick={toggleMenu}
            style={{ transition: "transform 0.2s" }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }>
            <FaBars size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="mt-4 lg:hidden overflow-hidden"
          style={{
            height: menuHeight,
            opacity: menuOpacity,
            transition: "height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          }}>
          <nav className="mb-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-black block py-2">
                  Shop by category
                </Link>
              </li>
              <li>
                <Link
                  href="/collections"
                  className="text-sm text-black block py-2">
                  Shop by collection
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col space-y-4">
            <div className="px-2">
              <SearchBar />
            </div>
            <div className="flex justify-around py-4 border-t border-gray-200">
              <Link
                href="/account"
                className="text-gray-600 hover:text-gray-800 flex flex-col items-center">
                <FaUser size={20} />
                <span className="text-xs mt-1">Account</span>
              </Link>
              <Link
                href="/wishlist"
                className="text-gray-600 hover:text-gray-800 flex flex-col items-center">
                <FaHeart size={20} />
                <span className="text-xs mt-1">Wishlist</span>
              </Link>
              <Link
                href="/cart"
                className="text-gray-600 hover:text-gray-800 flex flex-col items-center">
                <FaShoppingBag size={20} />
                <span className="text-xs mt-1">Cart</span>
              </Link>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors mx-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
