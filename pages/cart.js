import React, { useState, useEffect } from "react"; import { FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from 'next/router';
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import CartCard from "@/pages/components/CartCard"
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [cartVersion, setCartVersion] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }

        const userCart = userDoc.data().cart || [];
        
        // Fetch full item details for each cart item
        const itemPromises = userCart.map(async (cartItem) => {
          const itemDoc = await getDoc(doc(db, 'items', cartItem.itemId));
          if (!itemDoc.exists()) return null;
          
          return {
            ...itemDoc.data(),
            id: cartItem.itemId,
            quantity: cartItem.quantity
          };
        });

        const items = (await Promise.all(itemPromises)).filter(item => item !== null);
        setCartItems(items);

        // Calculate totals
        const price = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const discount = items.reduce(
          (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
          0
        );
        setTotalPrice(price);
        setTotalDiscount(discount);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [router, cartVersion]);

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      
      // Recalculate totals after filtering
      const newPrice = updatedItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 
        0
      );
      const newDiscount = updatedItems.reduce(
        (sum, item) => sum + ((item.originalPrice || item.price || 0) - (item.price || 0)) * (item.quantity || 1),
        0
      );
      
      // Update totals
      setTotalPrice(newPrice);
      setTotalDiscount(newDiscount);
      
      return updatedItems;
    });

    // Increment cart version to trigger refetch
    setCartVersion(prev => prev + 1);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      // Recalculate totals
      const newPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const newDiscount = updatedItems.reduce(
        (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
        0
      );

      setTotalPrice(newPrice);
      setTotalDiscount(newDiscount);

      return updatedItems;
    });
    setCartVersion(v => v + 1);
  };

  const handleEditItem = (itemId) => {
    router.push(`/Carddetails/${itemId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
          Your Cart
        </h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link href="/" className="text-purple-600 hover:text-purple-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <CartCard 
              cartItems={cartItems}
              handleRemoveItem={handleRemoveItem}
              handleQuantityChange={handleQuantityChange}
              handleEditItem={handleEditItem}
            />
            {/* Price details section */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Price Details ({cartItems.length}{" "}
                  {cartItems.length === 1 ? "Item" : "Items"})
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Total Product Price</p>
                    <p className="font-medium">+ ₹{totalPrice + totalDiscount}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Total Discounts</p>
                    <p className="font-medium text-green-600">- ₹{totalDiscount}</p>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <p>Order Total</p>
                    <p>₹{totalPrice}</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
                  <p className="text-sm">✨ Yay! Your total discount is ₹{totalDiscount}</p>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Clicking on 'Continue' will not deduct any money
                </p>
                <Link href="/checkout" className="block w-full">
                  <button className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors">
                    Continue
                  </button>
                </Link>
                <div className="mt-6 flex items-start">
                  <FaShieldAlt className="text-3xl md:text-4xl text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-semibold mb-1">Your Safety, Our Priority</h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      We ensure your package is safe at every point of contact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;