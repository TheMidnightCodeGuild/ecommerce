import { useState } from 'react';
import { useRouter } from 'next/router';
import { db, storage } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
      const imageUrls = await uploadImages();
      
      const processedData = {
        ...formData,
        price: Number(formData.price),
        createdAt: new Date().toISOString(),
        images: imageUrls
      };

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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Admin Dashboard</h1>
          
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Product</h2>
            
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="itemId">
                    Item ID
                  </label>
                  <input
                    type="text"
                    id="itemId"
                    name="itemId"
                    value={formData.itemId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="images">
                  Product Images
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  accept="image/*"
                  multiple
                  required
                />
                {imageFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="price">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tagline">
                    Tagline
                  </label>
                  <input
                    type="text"
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="productDetails">
                  Product Details
                </label>
                <textarea
                  id="productDetails"
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  rows="4"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="color">
                    Colors
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color.join(', ')}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="red, blue, green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="size">
                    Sizes
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size.join(', ')}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    placeholder="S, M, L, XL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="delivery">
                    Delivery
                  </label>
                  <input
                    type="text"
                    id="delivery"
                    name="delivery"
                    value={formData.delivery}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tags">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="casual, summer, trendy"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className={`w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploading ? 'Uploading...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
