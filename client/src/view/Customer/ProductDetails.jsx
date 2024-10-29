import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  StarHalf,
  ChevronLeft,
  ChevronRight,
  Truck,
  ArrowLeft,
  Shield,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
const URL = import.meta.env.VITE_APP_API;
const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const { productId } = useParams();
  const userId = JSON.parse(localStorage.getItem("ID"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${URL}/api/v1/product/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct({
          ...data,
          images: data.productImages, // In real app, use actual product images
          reviews: [
            // Demo reviews
            {
              id: 1,
              user: "John D.",
              rating: 5,
              comment: "Great product, exactly as described!",
              date: "2024-03-15",
            },
            {
              id: 2,
              user: "Sarah M.",
              rating: 4,
              comment: "Good quality but shipping took a while",
              date: "2024-03-10",
            },
            {
              id: 3,
              user: "Mike R.",
              rating: 5,
              comment: "Excellent value for money!",
              date: "2024-03-05",
            },
          ],
        });
      } catch (error) {
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = async (productId) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await axios.post(`${URL}/api/v1/cart/${userId}/items`, {
        productId,
        quantity: quantity, // Update quantity as necessary
      });

    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      // Add to wishlist logic here
    } finally {
      setAddingToWishlist(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-5 w-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="h-5 w-5 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
        <h2 className="text-xl font-semibold text-emerald-800">
          Loading product details...
        </h2>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">
            Oops! Something went wrong
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-12">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link to={"/dashboard/users/product"}>
          <button className="flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </button>
        </Link>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-emerald-50 rounded-xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/400";
                    e.target.classList.add("object-contain", "p-4");
                  }}
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-600 p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-600 p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ₹{
                      selectedImage === index ? 'border-emerald-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - View ${index + 1}`}
                      className="w-full h-full object-contain p-2 bg-emerald-50"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/80/80";
                        e.target.classList.add("object-contain", "p-1");
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="bg-emerald-50 text-emerald-600 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-2">
                  {product.category}
                </div>
                <h1 className="text-3xl font-bold text-emerald-900 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 mb-4"></div>
                <p className="text-emerald-600">{product.description}</p>
              </div>

              <div className="border-t border-b border-emerald-100 py-6">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold text-emerald-900">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-emerald-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="font-semibold text-emerald-700">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stock}
                    onChange={(e) =>
                      setQuantity(
                        Math.min(Math.max(1, e.target.value), product.stock)
                      )
                    }
                    className="w-16 text-center border border-emerald-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  disabled={addingToCart[product._id]}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-300"
                >
                  {addingToCart[product._id] ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  Add to Cart
                </button>

                <button
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-300"
                >
                  {addingToWishlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                  Wishlist
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-center">
                <div className="bg-emerald-50 rounded-lg p-4">
                  <Truck className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">
                    Free Shipping
                  </p>
                  <p className="text-xs text-emerald-500">
                    On orders over ₹150
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <Shield className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">
                    Warranty
                  </p>
                  <p className="text-xs text-emerald-500">
                    1-year warranty included
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <RefreshCw className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">
                    30-Day Returns
                  </p>
                  <p className="text-xs text-emerald-500">
                    Hassle-free returns
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="border-t border-emerald-100 p-8">
            <h2 className="text-2xl font-semibold text-emerald-900 mb-4">
              Customer Reviews
            </h2>
            {product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-emerald-100 pb-4"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      {renderRatingStars(review.rating)}
                      <span className="text-emerald-500 text-sm">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-emerald-700 font-semibold">
                      {review.user}
                    </p>
                    <p className="text-emerald-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-emerald-600">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
