import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q } = req.query;

  try {
    const itemsRef = collection(db, 'items');
    const searchTerm = q.toLowerCase();
    
    // Get all items since Firestore doesn't support OR queries directly
    const querySnapshot = await getDocs(itemsRef);

    const items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Check if search term matches title or tags
      if (data.title.toLowerCase().includes(searchTerm) || 
          data.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        items.push({ id: doc.id, ...data });
      }
    });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 