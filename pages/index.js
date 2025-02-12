import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Home from './home';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (user) {
    return <Home />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {!showLogin && !showSignup && (
        <>
          <h1 className="text-4xl font-bold mb-8">Welcome to Our App</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)} 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </>
      )}

      {showLogin && <Login />}
      {showSignup && <Signup />}
    </div>
  );
};

export default Index;