import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../../lib/firebase';

export default function CardDetails() {
  const router = useRouter();
  const { itemId } = router.query;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [zoomBoxPosition, setZoomBoxPosition] = useState({ left: 0, top: 0 });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1);
  const imageRef = useRef(null);
  const modalImageRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (itemId) {
        try {
          const docRef = doc(db, 'items', itemId);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            throw new Error('Product not found');
          }

          const data = docSnap.data();
          const transformedData = {
            id: docSnap.id,
            name: data.title,
            price: data.price,
            originalPrice: data.price * 1.2,
            discount: "20% off",
            rating: data.rating || 4.5,
            ratingCount: data.ratingCount || 100,
            reviewCount: data.reviewCount || 50,
            image: data.images?.[0] || '/placeholder-image.jpg',
            sizes: data.size.map(s => ({
              name: s,
              price: data.price,
              outOfStock: false
            })),
            details: [
              { label: "Product Details", value: data.productDetails },
              { label: "Colors", value: data.color.join(", ") },
              { label: "Delivery", value: data.delivery || "Free Delivery" },
              { label: "Tags", value: data.tags.join(", ") }
            ]
          };
          setProduct(transformedData);
        } catch (err) {
          setError('Error loading product details');
          console.error('Error fetching product:', err);
        }
      }
    };

    fetchProductDetails();
  }, [itemId]);

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Disable zoom on mobile

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });

    // Calculate zoom box position
    const boxWidth = 100;
    const boxHeight = 100;
    const newLeft = Math.min(
      Math.max(e.clientX - left - boxWidth / 2, 0),
      width - boxWidth
    );
    const newTop = Math.min(
      Math.max(e.clientY - top - boxHeight / 2, 0),
      height - boxHeight
    );
    setZoomBoxPosition({ left: newLeft, top: newTop });
  };

  const handleModalMouseMove = (e) => {
    if (!modalImageRef.current || window.innerWidth < 768) return;

    const { left, top, width, height } =
      modalImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    if (modalImageRef.current) {
      modalImageRef.current.style.transformOrigin = `${x}% ${y}%`;
    }
  };

  const handleModalWheel = (e) => {
    if (window.innerWidth < 768) return;
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(1, modalZoom + delta), 4);
    setModalZoom(newZoom);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setError(null);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
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
          quantity: 1,
          action: 'add'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      setSuccessMessage('Item added to cart successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setError('Please select a size');
      return;
    }
    // Buy now logic here
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          action: isFavorite ? "remove" : "add",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {successMessage}
        </div>
      )}
      {product && (
        <div className="max-w-[1300px] mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image Section */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div
                className="w-full max-w-md mx-auto relative"
                onMouseEnter={() =>
                  window.innerWidth >= 768 && setIsHovering(true)
                }
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}>
                <img
                  ref={imageRef}
                  src={product.image}
                  alt={product.name}
                  onClick={() => setIsImageModalOpen(true)}
                  className="w-full h-auto rounded-lg shadow-md cursor-pointer object-cover"
                />
                {isHovering && window.innerWidth >= 768 && (
                  <div
                    className="absolute pointer-events-none overflow-hidden bg-blue-700/10"
                    style={{
                      width: "200px",
                      height: "200px",
                      left: `${Math.min(
                        Math.max(0, zoomBoxPosition.left),
                        imageRef.current.width - 200
                      )}px`,
                      top: `${Math.min(
                        Math.max(0, zoomBoxPosition.top),
                        imageRef.current.height - 200
                      )}px`,
                      backgroundImage:
                        "linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)",
                      backgroundSize: "5px 5px",
                    }}
                  />
                )}
                <button
                  onClick={toggleFavorite}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 z-10 bg-white/50 rounded-full">
                  <FaHeart
                    className={`text-xl md:text-2xl ${
                      isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 w-full px-2 sm:px-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full sm:w-1/2 bg-white text-purple-600 border-2 border-purple-600 py-2 md:py-3 px-4 md:px-6 rounded-md hover:bg-purple-50 transition-colors flex items-center justify-center text-sm md:text-base font-semibold">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full sm:w-1/2 bg-purple-600 text-white rounded-md py-2 md:py-3 px-4 md:px-6 hover:bg-purple-700 transition-colors text-sm md:text-base font-semibold">
                  Buy Now
                </motion.button>
              </div>
              {error && (
                <p className="text-red-500 mt-2 text-center text-sm md:text-base">
                  {error}
                </p>
              )}
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 lg:pl-6">
              {isHovering && window.innerWidth >= 768 && (
                <div className="fixed border border-black top-20 -mx-20 mt-2 right-100 w-[720px] h-[475px] bg-white rounded-lg shadow-lg overflow-hidden hidden lg:block">
                  <div
                    style={{
                      backgroundImage: `url(${product.image})`,
                      backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                      backgroundSize: "180%",
                      backgroundRepeat: "no-repeat",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              )}

              <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-center mb-3 md:mb-4 flex-wrap">
                <span className="text-xl md:text-3xl font-bold mr-3">
                  ₹{product.price}
                </span>
                <span className="text-base md:text-xl text-gray-500 line-through mr-3">
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm md:text-lg text-green-600 font-medium">
                  {product.discount}
                </span>
              </div>

              {/* Rating Section */}
              <div className="flex items-center mb-3 md:mb-4 flex-wrap">
                <span className="bg-green-600 text-white px-2 py-1 rounded-md mr-3 flex items-center mb-2 sm:mb-0">
                  <span className="font-bold mr-1">{product.rating}</span>
                  <FaStar className="text-sm" />
                </span>
                <span className="text-xs md:text-sm text-gray-600">
                  {product.ratingCount.toLocaleString()} Ratings,{" "}
                  {product.reviewCount.toLocaleString()} Reviews
                </span>
              </div>

              <p className="text-green-600 font-semibold mb-4 md:mb-6 text-sm md:text-base">
                Free Delivery
              </p>

              {/* Size Selection */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={size.name}
                      onClick={() => handleSizeSelect(size)}
                      className={`border-2 rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm ${
                        size.outOfStock
                          ? "border-gray-300 text-gray-300 cursor-not-allowed"
                          : selectedSize === size
                          ? "border-purple-600 text-purple-600"
                          : "border-gray-300 hover:border-purple-600 hover:text-purple-600 transition-colors"
                      }`}
                      disabled={size.outOfStock}>
                      {size.name}
                      <span className="block font-semibold mt-1">
                        ₹{size.price}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
                  Product Details
                </h3>
                <ul className="list-none space-y-1 md:space-y-2">
                  {product.details.map((detail, index) => (
                    <motion.li
                      key={index}
                      className="flex flex-col sm:flex-row text-sm md:text-base"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}>
                      <span className="font-medium w-full sm:w-1/3 mb-1 sm:mb-0">
                        {detail.label}:
                      </span>
                      <span className="w-full sm:w-2/3">{detail.value}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}>
          <div
            className="relative w-full h-full md:w-[90vw] md:h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleModalMouseMove}
            onWheel={handleModalWheel}>
            <img
              ref={modalImageRef}
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-zoom-in"
              style={{
                transform: `scale(${window.innerWidth >= 768 ? modalZoom : 1})`,
              }}
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-2xl md:text-3xl hover:text-gray-300 bg-black/50 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}