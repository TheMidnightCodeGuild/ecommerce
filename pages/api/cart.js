import { db } from '../../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, itemId, action } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentCart = userDoc.data().cart || [];
    if (action === 'remove') {
      try {
        // Check if item exists in cart
        const itemExists = currentCart.some(item => item.itemId === itemId);
        if (!itemExists) {
          return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Filter out the item to be removed
        const updatedCart = currentCart.filter(item => item.itemId !== itemId);
        
        // Update the cart in Firestore
        await updateDoc(userRef, {
          cart: updatedCart
        });

        return res.status(200).json({ 
          message: 'Item removed from cart successfully',
          cart: updatedCart
        });
      } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ message: 'Failed to remove item from cart' });
      }
    } else if (action === 'add') {
      // Add new item to cart
      const newCartItem = {
        itemId,
        quantity: 1,
      };
      
      const updatedCart = [...currentCart, newCartItem];
      await updateDoc(userRef, {
        cart: updatedCart
      });

      return res.status(200).json({ message: 'Item added to cart successfully' });
    } else if (action === 'update') {
      // Update item quantity
      const updatedCart = currentCart.map(item => {
        if (item.itemId === itemId) {
          return { ...item, quantity: req.body.quantity };
        }
        return item;
      });

      await updateDoc(userRef, {
        cart: updatedCart
      });

      return res.status(200).json({ message: 'Cart updated successfully' });
    }

    return res.status(400).json({ message: 'Invalid action' });

  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}