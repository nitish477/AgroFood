import React, { useState, useEffect } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import {
  Bell,
  Building,
  Menu,
  X,
  CircleUser,
  Users,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Tractor,
  Store,
  BarChart,
  ClipboardList,
  ShoppingCart,
} from "lucide-react";

const URL = import.meta.env.VITE_APP_API;

const DashboardLayout = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRoles, setUserRoles] = useState(JSON.parse(localStorage.getItem("userRole")) || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const userId = JSON.parse(localStorage.getItem("ID"));

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && 
          !event.target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/cart/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setCartCount(data.items?.length || 0);
        } else {
          console.error('Failed to fetch cart data');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (token && userRoles.includes('user')) {
      fetchCartCount();
    }
  }, []);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("ID");
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  const roleBasedRoutes = {
    admin: [
      {
        id: "admin-users",
        label: "Product Management",
        icon: Users,
        subroutes: [
          { path: "/dashboard/admin/list", label: "All Product" },
        ],
      },
      {
        id: "admin-system",
        label: "System Overview",
        icon: BarChart,
        subroutes: [
          { path: "/dashboard/admin/system", label: "Dashboard" },
          { path: "/dashboard/system/logs", label: "System Logs" },
          { path: "/dashboard/system/settings", label: "Settings" },
        ],
      },
    ],
    farmer: [
      {
        id: "farmer-management",
        label: "Farm Management",
        icon: Tractor,
        subroutes: [
          { path: "/dashboard/farm/crops", label: "Crop Management" },
          { path: "/dashboard/farm/inventory", label: "Farm Inventory" },
          { path: "/dashboard/farm/schedule", label: "Planning" },
        ],
      },
      {
        id: "farmer-sales",
        label: "Sales",
        icon: ShoppingBag,
        subroutes: [
          { path: "/dashboard/sales/orders", label: "Orders" },
          { path: "/dashboard/sales/pricing", label: "Pricing" },
          { path: "/dashboard/sales/history", label: "Sales History" },
        ],
      },
    ],
    vendor: [
      {
        id: "vendor-store",
        label: "Store Management",
        icon: Store,
        subroutes: [
          { path: "/dashboard/store/products", label: "Products" },
          { path: "/dashboard/store/orders", label: "Orders" },
          { path: "/dashboard/store/inventory", label: "Inventory" },
        ],
      },
      {
        id: "vendor-ops",
        label: "Operations",
        icon: ClipboardList,
        subroutes: [
          { path: "/dashboard/operations/delivery", label: "Deliveries" },
          { path: "/dashboard/operations/schedule", label: "Schedule" },
          { path: "/dashboard/operations/reports", label: "Reports" },
        ],
      },
    ],
    user: [
      {
        id: "user-orders",
        label: "My Orders",
        icon: ShoppingBag,
        subroutes: [
          { path: "/dashboard/users/product", label: "All Product" },
          { path: "/dashboard/users/order", label: "Order History" },
          { path: "/dashboard/users/tracking", label: "Track Orders" },
        ],
      },
      {
        id: "user-account",
        label: "Account",
        icon: CircleUser,
        subroutes: [
          { path: "/dashboard/account/profile", label: "Profile" },
          { path: "/dashboard/account/preferences", label: "Preferences" },
          { path: "/dashboard/account/addresses", label: "Addresses" },
        ],
      },
    ],
  };

  const activeRoutes = userRoles.reduce((acc, role) => {
    if (roleBasedRoutes[role]) {
      return [...acc, ...roleBasedRoutes[role]];
    }
    return acc;
  }, []);

  const renderSidebar = (isMobile = false) => (
    <aside className={`
      ${isMobile 
        ? 'fixed inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-in-out z-50'
        : 'hidden md:flex md:w-72 lg:w-80 flex-col'}
      ${isMobile && !isMenuOpen ? '-translate-x-full' : 'translate-x-0'}
      border-r border-emerald-200 bg-white/80 backdrop-blur-sm
    `}>
      <div className="flex h-20 items-center border-b border-emerald-200 px-6">
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-lg hover:bg-emerald-50"
          >
            <X className="h-5 w-5 text-emerald-600" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <img 
              src="https://www.shutterstock.com/image-vector/agro-farm-logo-agriculture-260nw-2057190761.jpg"
              alt="Agro Store"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-emerald-900">
              PORTAL
            </span>
            <span className="text-sm text-emerald-600">
              {userRoles.join(" & ")} Dashboard
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {activeRoutes.map((route) => (
          <div key={route.id} className="mb-6">
            <button
              onClick={() => toggleSection(route.id)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm font-semibold text-emerald-900 border-b border-emerald-100"
            >
              <div className="flex items-center gap-3">
                <route.icon className="h-5 w-5 text-emerald-600" />
                <span>{route.label}</span>
              </div>
              {expandedSections[route.id] ? (
                <ChevronDown className="h-4 w-4 text-emerald-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-emerald-600" />
              )}
            </button>
            {expandedSections[route.id] && (
              <div className="mt-2 space-y-1">
                {route.subroutes.map((subroute) => (
                  <NavLink
                    key={subroute.path}
                    to={subroute.path}
                    onClick={() => isMobile && setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg px-8 py-2.5 text-sm transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-900 font-medium shadow-sm"
                          : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-900"
                      }`
                    }
                  >
                    {subroute.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-emerald-200">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50">
          <div className="p-2 bg-emerald-100 rounded-full">
            <CircleUser className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-emerald-900">Roles</span>
            <span className="text-xs text-emerald-600 capitalize">
              {userRoles.join(", ")}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-[100vh] flex-col md:flex-row bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Desktop Sidebar */}
      {renderSidebar(false)}

      {/* Mobile Sidebar */}
      {renderSidebar(true)}

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center gap-4 border-b border-emerald-200 bg-white/80 backdrop-blur-sm px-6 z-30">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="menu-button md:hidden p-2 rounded-lg hover:bg-emerald-50"
          >
            <Menu className="h-5 w-5 text-emerald-600" />
          </button>

          <div className="flex-1" />

          {userRoles.includes("user") && (
            <Link to="/dashboard/users/cart">
              <button className="relative p-2 rounded-full hover:bg-emerald-50">
                <ShoppingCart className="h-5 w-5 text-emerald-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[0.5rem] text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          )}

          <button className="p-2 rounded-lg hover:bg-emerald-50">
            <Bell className="h-5 w-5 text-emerald-600" />
          </button>

          <div className="relative user-menu">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 rounded-full p-2 hover:bg-emerald-50"
            >
              <CircleUser className="h-6 w-6 text-emerald-600" />
              <ChevronDown className="h-4 w-4 text-emerald-600" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-emerald-100 bg-white shadow-lg p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                >
                  <CircleUser className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;