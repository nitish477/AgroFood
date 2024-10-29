import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Loader2, Save, X } from 'lucide-react';
import { Link, useParams ,useNavigate} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const URL = import.meta.env.VITE_APP_API;
const UpdateProduct = () => {
  const { id } = useParams(); // Get product ID from route
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    manufacturingDate: '',
    price: '',
    unit: '',
    stock: '',
    description: '',
    instructions: ''
  });
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };

  const categories = [
    'Seeds',
    'Fertilizers',
    'Pesticides',
    'Farm Tools',
    'Irrigation Equipment',
    'Organic Products',
    'Animal Feed',
    'Plant Protection',
    'Agricultural Machinery'
  ];

  const unitTypes = [
    'kg',
    'g',
    'L',
    'mL',
    'pieces',
    'packets',
    'bags'
  ];

  useEffect(() => {
   
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/api/v1/product/products/${id}`);
        const product = await response.json();
        setFormData({
          name: product.name,
          category: product.category,
          brand: product.brand,
          manufacturingDate: formatDate(product.manufacturingDate), // Format date here
          price: product.price,
          unit: product.unit,
          stock: product.stock,
          description: product.description,
          instructions: product.instructions,
        });
        setProductImages(product.productImages || []);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductData();
  }, [id]); // Ensure you add `id` as a dependency
  

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      // Reset form and images
      setFormData({
        name: '',
        category: '',
        brand: '',
        manufacturingDate: '',
        price: '',
        unit: '',
        stock: '',
        description: '',
        instructions: ''
      });
      setProductImages([]);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      setUploadingImage(true);
      
      try {
        const photoUrls = await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "chat-app");
            
            const response = await fetch(
              "https://api.cloudinary.com/v1_1/dbqdqof8u/image/upload",
              {
                method: "POST",
                body: formData,
              }
            );
            
            const data = await response.json();
            return data.secure_url;
          })
        );
        
        setProductImages((prev) => [...prev, ...photoUrls]);
      } catch (error) {
        console.error("Error uploading images:", error);
        alert("Failed to upload images. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = (indexToRemove) => {
    setProductImages(productImages.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const productData = {
      ...formData,
      productImages: productImages
    };

    try {
      // Update product with PUT request
      const response = await fetch(`${URL}/api/v1/product/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success("Product updated successfully");
        navigate('/dashboard/admin/list');
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-6xl mb-2  py-2">
        <Link to={"/dashboard/admin/list"}>
        <button
        onClick={handleCancel}
        className="group flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-all duration-200 ease-in-out"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Back to Products</span>
      </button>
        </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            Update Product
          </h1>
          <p className="text-gray-600 mt-2 max-w-xl">
            Modify the details below to update the product in your inventory
          </p>
        </div>
        
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-50 flex items-center justify-center p-4 border-2 border-green-100">
            <img 
              src="https://www.shutterstock.com/image-vector/agro-farm-logo-agriculture-260nw-2057190761.jpg"
              alt="Agro Store"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-green-100">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-700 border-b border-green-100 pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., Organic Fertilizer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., GreenGrow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Stock Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-700 border-b border-green-100 pb-2">
              Pricing & Stock
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)*
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Type*
                </label>
                <select
                  required
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Unit</option>
                  {unitTypes.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity*
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Available quantity"
                />
              </div>
            </div>
          </div>


          {/* Description Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-700 border-b border-green-100 pb-2">
              Product Details
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter product description"
                  rows="4"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Instructions
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter usage instructions"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-700 border-b border-green-100 pb-2">
              Product Images
            </h2>

 
              <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-green-300 border-dashed rounded-xl cursor-pointer bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={40} className="animate-spin text-green-500 mb-2" />
                        <p className="text-sm text-green-600">Uploading images...</p>
                      </div>
                    ) : (
                      <>
                        <Camera size={40} className="text-green-500 mb-3" />
                        <p className="text-sm text-gray-600 font-medium mb-1">Click to upload product images</p>
                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {/* Image Preview Grid */}
              {productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  {productImages.map((url, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden shadow-md">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-gray-600 hover:text-gray-700 font-medium rounded-lg transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors disabled:bg-green-400 shadow-sm hover:shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default UpdateProduct;
