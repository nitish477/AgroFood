import React from 'react';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { TrendingUp, ShoppingCart, Users, DollarSign, Package } from 'lucide-react';

const Dashboard = () => {
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  const productCategories = [
    { name: 'Organic Vegetables', value: 400 },
    { name: 'Fresh Fruits', value: 300 },
    { name: 'Dairy Products', value: 200 },
    { name: 'Grains', value: 150 },
  ];

  // Green-themed colors
  const COLORS = ['#059669', '#34D399', '#6EE7B7', '#A7F3D0'];

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-green-900">AgroFood Dashboard</h1>
        <p className="text-green-600">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600">Total Sales</p>
              <p className="text-xl md:text-2xl font-bold text-green-900">$24,780</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600">Total Orders</p>
              <p className="text-xl md:text-2xl font-bold text-green-900">1,482</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-full">
              <ShoppingCart className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600">Active Users</p>
              <p className="text-xl md:text-2xl font-bold text-green-900">892</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600">Products</p>
              <p className="text-xl md:text-2xl font-bold text-green-900">246</p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 rounded-full">
              <Package className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-green-100">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-green-900">Monthly Sales</h2>
          <div className="w-full overflow-x-auto">
            <LineChart width={500} height={300} data={salesData} className="w-full">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#059669" />
              <YAxis stroke="#059669" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
            </LineChart>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-green-100">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-green-900">Product Categories</h2>
          <div className="w-full overflow-x-auto">
            <PieChart width={500} height={300} className="w-full ">
              <Pie
                data={productCategories}
                cx={250}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {productCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-green-100">
        <div className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-green-900">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-green-100">
                  <th className="pb-2 md:pb-3 text-green-800">Order ID</th>
                  <th className="pb-2 md:pb-3 text-green-800">Customer</th>
                  <th className="pb-2 md:pb-3 text-green-800">Product</th>
                  <th className="pb-2 md:pb-3 text-green-800">Amount</th>
                  <th className="pb-2 md:pb-3 text-green-800">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-green-50">
                  <td className="py-2 md:py-3 text-green-700">#12345</td>
                  <td className="text-green-700">John Doe</td>
                  <td className="text-green-700">Organic Vegetables Bundle</td>
                  <td className="text-green-700">$89.99</td>
                  <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Delivered</span></td>
                </tr>
                <tr className="border-b border-green-50">
                  <td className="py-2 md:py-3 text-green-700">#12346</td>
                  <td className="text-green-700">Jane Smith</td>
                  <td className="text-green-700">Fresh Fruits Pack</td>
                  <td className="text-green-700">$64.99</td>
                  <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Processing</span></td>
                </tr>
                <tr>
                  <td className="py-2 md:py-3 text-green-700">#12347</td>
                  <td className="text-green-700">Robert Johnson</td>
                  <td className="text-green-700">Dairy Products Bundle</td>
                  <td className="text-green-700">$129.99</td>
                  <td><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Shipped</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
