import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const itemsRef = collection(db, 'items');
    const querySnapshot = await getDocs(itemsRef);
    
    const suggestions = new Set();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Check title
      if (data.title.toLowerCase().includes(q.toLowerCase())) {
        suggestions.add({
          type: 'title',
          value: data.title
        });
      }
      
      // Check tags
      data.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(q.toLowerCase())) {
          suggestions.add({
            type: 'tag',
            value: tag
          });
        }
      });
    });

    const uniqueSuggestions = Array.from(suggestions).slice(0, 5);
    res.status(200).json(uniqueSuggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
} 