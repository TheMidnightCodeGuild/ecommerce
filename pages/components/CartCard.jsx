import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { auth, db } from '../../lib/firebase';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';

const CartCard = ({ cartItems, handleRemoveItem, handleQuantityChange, handleEditItem }) => {
  const handleRemove = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          itemId: itemId,
          action: 'remove'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      // Call the parent component's handler to update the UI
      handleRemoveItem(itemId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          itemId: itemId,
          quantity: newQuantity,
          action: 'update'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      handleQuantityChange(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div className="w-full lg:w-2/3">
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={item.image}
              alt={item.name}
              className="w-full md:w-24 h-48 md:h-24 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-grow w-full">
              <div className="flex flex-col md:flex-row justify-between items-start mb-2 md:mb-0">
                <h3 className="text-lg font-semibold mb-2 md:mb-0">
                  {item.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditItem(item.id)}
                    className="text-purple-600 hover:text-purple-700">
                    <FaEdit className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700">
                      <FaTrash className="text-xl" />
                  </button>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                ₹{item.price}{" "}
                <span className="text-sm font-normal text-gray-500 line-through">
                  ₹{item.originalPrice}
                </span>{" "}
                <span className="text-sm font-medium text-pink-600">
                  {item.discount}% Off
                </span>
              </p>
              <div className="flex items-center">
                <label className="mr-2">Quantity:</label>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => handleQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 border-r hover:bg-gray-100">
                    -
                  </button>
                  <span className="px-3 py-1">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border-l hover:bg-gray-100">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartCard;