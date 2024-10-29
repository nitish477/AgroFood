import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast,{Toaster} from "react-hot-toast"
const URL = import.meta.env.VITE_APP_API;
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const observer = useRef();
  const searchTimeout = useRef(null);

 const   categories =    [
  'Seeds',
  'Fertilizers',
  'Pesticides',
  'Farm Tools',
  'Irrigation Equipment',
  'Organic Products',
  'Animal Feed',
  'Plant Protection',
  'Agricultural Machinery'
]  

  // Fetch categories on mount
 
  // Fetch products with filters
  const fetchProducts = async (isNewSearch = false) => {
    try {
      const response = await fetch(`${URL}/api/v1/product/products`);
      const data = await response.json();
  
      // Filter the data based on search and filters
      const filteredData = data.filter(product => {
        const matchesSearch =
          (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesPriceRange =
          (!priceRange.min || product.price >= Number(priceRange.min)) &&
          (!priceRange.max || product.price <= Number(priceRange.max));
  
        return matchesSearch && matchesCategory && matchesPriceRange;
      });
  
      if (isNewSearch) {
        setProducts(filteredData);
      } else {
        setProducts(prev => [...prev, ...filteredData]);
      }
  
      setHasMore(filteredData.length === 10);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };
  

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProducts(1, true);
    }, 5);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm, selectedCategory, priceRange.min, priceRange.max]);

  // Infinite scroll setup
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
        fetchProducts(page + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Delete handler
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${URL}/api/v1/product/products/${productId}`, {
          method: 'DELETE',
        });
        setProducts(products.filter(product => product._id !== productId));
        toast.success("delete successfully")
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };


  const toggleDropdown = (e, productId) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === productId ? null : productId);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Top Header Section */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Products</h1>
              <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            <Link to="/dashboard/admin/add-product">
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-sm">
                <Plus size={20} />
                Add Product
              </button>
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <SlidersHorizontal size={20} />
              Filters
              {(selectedCategory || priceRange.min || priceRange.max) && 
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              }
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-700">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Reset all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Min price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Max price"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-green-600 hover:text-green-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={product._id}
                ref={index === products.length - 1 ? lastProductRef : null}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative group"
              >
                {/* Actions Dropdown */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={(e) => toggleDropdown(e, product._id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  
                  {openDropdownId === product._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      <Link
                        to={`/dashboard/admin/edit-product/${product._id}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 gap-2"
                      >
                        <Edit size={16} />
                        Edit Product
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full gap-2"
                      >
                        <Trash2 size={16} />
                        Delete Product
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Image Container */}
                <div className="relative h-64 bg-gray-100">
                  <img
                    src={product.productImages[0]}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/300";
                      e.target.onerror = null;
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h2 className="text-xl font-semibold text-green-800 line-clamp-2">
                      {product.title}
                    </h2>
                    <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                      ${product.price}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <button className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading More Indicator */}
        {loading && products.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      <Toaster/>
    </div>
  );
};

export default Products;