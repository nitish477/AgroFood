import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Loader2, Leaf, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from "axios"
const URL = import.meta.env.VITE_APP_API;
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [initialPriceRange, setInitialPriceRange] = useState({ min: "", max: "" });
  const userId= JSON.parse(localStorage.getItem("ID"))
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${URL}/api/v1/product/products`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);

        // Set initial price range from fetched products
        const prices = data.map(product => product.price);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange({ min: minPrice, max: maxPrice });
          setInitialPriceRange({ min: minPrice, max: maxPrice });
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = !searchQuery ||
        (product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.description?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      // Only check price if both min and max are set
      const matchesPrice = (priceRange.min === '' || product.price >= priceRange.min) &&
                           (priceRange.max === '' || product.price <= priceRange.max);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, priceRange, products]);
  

  const handleAddToCart = async (productId) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
  
    try {
      // Assuming the user ID is stored in a variable called `userId`
      const response = await axios.post(`${URL}/api/v1/cart/${userId}/items`, {
        productId,
        quantity: 1 // Change quantity as needed
      });
  
      console.log('Item added to cart:', response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };
  

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' }); // Reset to empty
  };




  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
        <h2 className="text-xl font-semibold text-emerald-800">Loading amazing products...</h2>
        <p className="text-emerald-600 mt-2">Please wait while we fetch the latest items</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md text-center shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Leaf className="h-8 w-8 text-emerald-600" />
          <h1 className="text-4xl font-bold text-emerald-800">Eco Shop</h1>
        </div>
        <p className="text-emerald-600 text-center mb-8 text-lg">Discover our sustainable collection</p>
        
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-3 rounded-full border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${activeFilterCount > 0 ? 'text-emerald-600' : 'text-emerald-400'} hover:text-emerald-700`}
              >
                <div className="relative">
                  <SlidersHorizontal className="h-5 w-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="max-w-2xl mx-auto mt-4 p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-emerald-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Reset all filters
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full p-2 rounded-md border ${
                      selectedCategory !== 'all' ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200'
                    } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-emerald-700 font-medium mb-2">Price Range</label>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">$</span>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        placeholder="Min"
                        className={`w-full pl-8 p-2 rounded-md border ${
                          priceRange.min !== initialPriceRange.min ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200'
                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`}
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600">$</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        placeholder="Max"
                        className={`w-full pl-8 p-2 rounded-md border ${
                          priceRange.max !== initialPriceRange.max ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200'
                        } focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="mt-6 pt-4 border-t border-emerald-100">
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Search: {searchQuery}
                        <button onClick={clearSearch} className="hover:text-emerald-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Category: {selectedCategory}
                        <button onClick={() => setSelectedCategory('all')} className="hover:text-emerald-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {(priceRange.min !== initialPriceRange.min || priceRange.max !== initialPriceRange.max) && (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Price: ${priceRange.min} - ${priceRange.max}
                        <button onClick={() => setPriceRange(initialPriceRange)} className="hover:text-emerald-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-emerald-600">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {activeFilterCount > 0 && ' with active filters'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product._id} 
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-emerald-100"
          >
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-white/90 backdrop-blur-sm text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                {product.category}
              </div>
            </div>

            {/* Image Container */}
            <div className="relative h-72 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-emerald-50/30">
              <img
                src={product.productImages[0]}
                alt={product.title}
                className="w-full h-full object-contain p-8 transform group-hover:scale-110 transition-transform duration-500 ease-out"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300';
                  e.target.classList.add('object-contain', 'p-4');
                }}
              />
              
              {/* Quick View Overlay */}
              <div className="absolute inset-0 bg-emerald-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <Link 
                  to={`/dashboard/users/product-details/${product._id}`}
                  className="transform -translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-100"
                >
                  <button className="bg-white hover:bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Eye className="h-4 w-4" />  View
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-emerald-900 mb-2 truncate hover:text-emerald-700 transition-colors">
                {product.title}
              </h2>
              <p className="text-emerald-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-emerald-500 font-medium">Price</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <button 
                  className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  onClick={() => handleAddToCart(product._id)}
                  disabled={addingToCart[product._id]}
                >
                  {addingToCart[product._id] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-medium">Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span className="font-medium">Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-emerald-50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-emerald-800 mb-2">No products found</h3>
              <p className="text-emerald-600 mb-4">
                No products match your current filters. Try adjusting your search or filters.
              </p>
              <button
                onClick={resetFilters}
                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mx-auto"
              >
                <X className="h-4 w-4" />
                Reset all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;