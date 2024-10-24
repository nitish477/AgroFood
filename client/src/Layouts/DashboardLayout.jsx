import React, { useState, useEffect } from "react";
import { Link, NavLink, Navigate, Outlet } from "react-router-dom";
import {
  Bell,
  Building,
  Menu,
  CircleUser,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Tractor,
  Store,
  BarChart,
  ClipboardList,
} from "lucide-react";

const DashboardLayout = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRoles, setUserRoles] = useState(JSON.parse(localStorage.getItem("userRole")) || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
console.log(userRoles);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userRoles");
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Define routes based on roles
  const roleBasedRoutes = {
    admin: [
      {
        id: "admin-users",
        label: "User Management",
        icon: Users,
        subroutes: [
          { path: "/dashboard/users/list", label: "All Users" },
          { path: "/dashboard/users/roles", label: "Role Management" },
          { path: "/dashboard/users/analytics", label: "User Analytics" },
        ],
      },
      {
        id: "admin-system",
        label: "System Overview",
        icon: BarChart,
        subroutes: [
          { path: "/dashboard/system/metrics", label: "Key Metrics" },
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
          { path: "/dashboard/orders/active", label: "Active Orders" },
          { path: "/dashboard/orders/history", label: "Order History" },
          { path: "/dashboard/orders/tracking", label: "Track Orders" },
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

  // Combine routes from all user roles
  const activeRoutes = userRoles.reduce((acc, role) => {
    if (roleBasedRoutes[role]) {
      return [...acc, ...roleBasedRoutes[role]];
    }
    return acc;
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-72 lg:w-80 flex-col border-r border-emerald-200 bg-white/80 backdrop-blur-sm">
        <div className="flex h-20 items-center border-b border-emerald-200 px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building className="h-8 w-8 text-emerald-600" />
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-20 items-center gap-4 border-b border-emerald-200 bg-white/80 backdrop-blur-sm px-6">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-emerald-50"
          >
            <Menu className="h-5 w-5 text-emerald-600" />
          </button>

          <div className="flex-1" />

          <button className="relative p-2 rounded-lg hover:bg-emerald-50">
            <Bell className="h-5 w-5 text-emerald-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-2 hover:bg-emerald-50"
            >
              <CircleUser className="h-5 w-5 text-emerald-600" />
              <ChevronDown className="h-4 w-4 text-emerald-600" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-emerald-200 bg-white/95 backdrop-blur-sm p-1 shadow-lg">
                <div className="px-4 py-2 border-b border-emerald-100">
                  <p className="text-sm font-medium text-emerald-900">
                    {userRoles.join(" & ")} Account
                  </p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50">
                  <HelpCircle className="h-4 w-4" />
                  <span>Support</span>
                </button>
                <hr className="my-1 border-emerald-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-b border-emerald-200 bg-white/95 backdrop-blur-sm">
            {activeRoutes.map((route) => (
              <div key={route.id} className="border-b border-emerald-100 last:border-0">
                <button
                  onClick={() => toggleSection(route.id)}
                  className="flex w-full items-center justify-between p-4 font-medium text-emerald-900"
                >
                  <div className="flex items-center gap-2">
                    <route.icon className="h-5 w-5 text-emerald-600" />
                    {route.label}
                  </div>
                  {expandedSections[route.id] ? (
                    <ChevronDown className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-emerald-600" />
                  )}
                </button>
                {expandedSections[route.id] && (
                  <div className="bg-emerald-50/50 px-4 py-2">
                    {route.subroutes.map((subroute) => (
                      <Link
                        key={subroute.path}
                        to={subroute.path}
                        className="block py-2.5 text-sm text-emerald-600 hover:text-emerald-900"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subroute.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;