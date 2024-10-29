import React, { useState, useEffect } from 'react';
import { Trash2, MinusCircle, PlusCircle, RefreshCcw, ShoppingCart, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle,Badge,Separator } from './../../component/ui/card';
import { Alert, AlertDescription } from './../../component/ui/alert';
import { Button } from './../../component/ui/button';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem("ID"));

  // Existing fetch, update, remove, and clear functions remain the same
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_API}/api/v1/cart/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API}/api/v1/cart/${userId}/items/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API}/api/v1/cart/${userId}/items/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to remove item');
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API}/api/v1/cart/${userId}/clear`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      setCart({ items: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <RefreshCcw className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription className="flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-sm text-gray-500">
              {cart?.items?.length || 0} {cart?.items?.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        {cart?.items?.length > 0 && (
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={clearCart}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {(!cart?.items || cart.items.length === 0) ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <PackageOpen className="w-16 h-16 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium text-gray-700">Your cart is empty</p>
                <p className="text-gray-500">Add items to your cart to see them here</p>
              </div>
              <Button className="mt-4">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
          {cart.items.map((item) => (
  <Card key={item.product._id} className="group hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-6">
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={item.product.productImages && item.product.productImages[0] ? item.product.productImages[0] : '/path/to/placeholder-image.jpg'}
            alt={item.product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg truncate">{item.product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">${item.pricePerUnit.toFixed(2)} per unit</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={() => removeItem(item.product._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.product._id, Math.max(0, item.quantity - 1))}
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
              >
                <PlusCircle className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">${item.totalPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
))}

          </div>

          <Card className="mt-8 bg-gray-50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Free</Badge>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-sm text-gray-500">Including VAT</p>
                </div>
                <p className="text-3xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="bg-white mt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cart;