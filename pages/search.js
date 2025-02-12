import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from "@/pages/components/SearchBar"

export default function SearchResults() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { q } = router.query;

  useEffect(() => {
    if (q) {
      fetchResults();
    }
  }, [q]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
    setLoading(false);
  };

  const handleCardClick = (itemId) => {
    router.push(`/Carddetails/${itemId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Search Results for "{q}"
          </h2>
          
          {items.length === 0 ? (
            <div className="text-center text-gray-500">
              No results found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleCardClick(item.id)}
                >
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-gray-100 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}