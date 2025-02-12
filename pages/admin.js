import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, storage } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemId: '',
    title: '',
    price: '',
    rating: 0,
    ratingCount: 0,
    reviews: [],
    reviewCount: 0,
    productDetails: '',
    color: [],
    size: [],
    tags: [],
    tagline: '',
    delivery: '',
    images: []
  });
  const [message, setMessage] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (['color', 'size', 'tags'].includes(name)) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value ? value.split(',').map(item => item.trim()) : []
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    if (!storage) {
      throw new Error('Storage is not initialized');
    }

    const uploadedUrls = [];
    
    for (const file of imageFiles) {
      try {
        const storageRef = ref(storage, `products/${formData.itemId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Upload images first
      const imageUrls = await uploadImages();
      
      const processedData = {
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString(),
        images: imageUrls
      };

      // Add document to Firestore
      await addDoc(collection(db, 'items'), processedData);

      setMessage('Item added successfully!');
      setFormData({
        itemId: '',
        title: '',
        price: '',
        rating: 0,
        ratingCount: 0,
        reviews: [],
        reviewCount: 0,
        productDetails: '',
        color: [],
        size: [],
        tags: [],
        tagline: '',
        delivery: '',
        images: []
      });
      setImageFiles([]);
    } catch (error) {
      setMessage('Failed to add item. Please try again.');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemId">
              Item ID
            </label>
            <input
              type="text"
              id="itemId"
              name="itemId"
              value={formData.itemId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
              Product Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              accept="image/*"
              multiple
              required
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected {imageFiles.length} image(s)
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDetails">
              Product Details
            </label>
            <textarea
              id="productDetails"
              name="productDetails"
              value={formData.productDetails}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="red, blue, green"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="size">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="S, M, L, XL"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="casual, summer, trendy"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tagline">
              Tagline
            </label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="delivery">
              Delivery
            </label>
            <input
              type="text"
              id="delivery"
              name="delivery"
              value={formData.delivery}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
