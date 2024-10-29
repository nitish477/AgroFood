import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const URL = import.meta.env.VITE_APP_API;

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: "", // Changed from roles array to single role string
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [loadingField, setLoadingField] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Available roles
  const availableRoles = [
    { id: "user", label: "User" },
    { id: "admin", label: "Admin" },
    { id: "farmer", label: "Farmer" },
    { id: "vendor", label: "Vendor" },
  ];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setLoadingField("email");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoadingField(null);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };


  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.roles) {
      newErrors.roles = "Please select a role"; // Changed error message for single role
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setSubmitStatus("validating");

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubmitStatus("processing");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await axios.post(`${URL}/api/v1/auth/register`, formData);

        if (res?.status === 201) {
          toast.success(res?.data?.message);
          setSubmitStatus("completing");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setSubmitStatus("success");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          navigate("/auth/login");
        }
      } catch (err) {
        setIsLoading(false);
        setSubmitStatus(null);
        const errorMessage =
          err.response?.data?.message || "An error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } else {
      setErrors(newErrors);
      setIsLoading(false);
    }
  };

  const handleFocus = (fieldName) => {
    setCurrentField(fieldName);
  };

  const handleBlur = () => {
    setCurrentField(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fadeIn">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-[100%] relative">
          {submitStatus && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl z-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-green-600 text-lg font-medium">
                  {submitStatus === "validating" && "Validating..."}
                  {submitStatus === "processing" && "Processing..."}
                  {submitStatus === "completing" && "Completing..."}
                  {submitStatus === "success" && (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Success!
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 animate-slideDown">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 animate-fadeIn">
              Join us and start your journey
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Regular fields */}
              <div
                className={`transform transition-all duration-300 ${
                  currentField === "fullName" ? "scale-105" : ""
                }`}
              >
                <div className="relative">
                  <label
                    htmlFor="fullName"
                    className={`block text-sm font-medium transition-colors duration-300 ${
                      currentField === "fullName"
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => handleFocus("fullName")}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-lg shadow-sm 
                      transition-all duration-300 ease-in-out
                      ${
                        currentField === "fullName"
                          ? "border-green-500 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-green-300"
                      }
                      focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 animate-shake">
                      {errors.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`transform transition-all duration-300 ${
                  currentField === "email" ? "scale-105" : ""
                }`}
              >
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium transition-colors duration-300 ${
                      currentField === "email"
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className={`mt-1 block w-full px-4 py-3 border-2 rounded-lg shadow-sm 
                        transition-all duration-300 ease-in-out
                        ${
                          currentField === "email"
                            ? "border-green-500 ring-2 ring-green-200"
                            : "border-gray-200 hover:border-green-300"
                        }
                        focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                    />
                    {loadingField === "email" && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 animate-shake">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password fields with show/hide toggle */}
              {["password", "confirmPassword"].map((field, index) => (
                <div
                  key={field}
                  className={`transform transition-all duration-300 ${
                    currentField === field ? "scale-105" : ""
                  }`}
                >
                  <div className="relative">
                    <label
                      htmlFor={field}
                      className={`block text-sm font-medium transition-colors duration-300 ${
                        currentField === field
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {field === "password" ? "Password" : "Confirm Password"}
                    </label>
                    <div className="relative">
                      <input
                        id={field}
                        name={field}
                        type={showPassword[field] ? "text" : "password"}
                        value={formData[field]}
                        onChange={handleChange}
                        onFocus={() => handleFocus(field)}
                        onBlur={handleBlur}
                        className={`mt-1 block w-full px-4 py-3 pr-12 border-2 rounded-lg shadow-sm 
                          transition-all duration-300 ease-in-out
                          ${
                            currentField === field
                              ? "border-green-500 ring-2 ring-green-200"
                              : "border-gray-200 hover:border-green-300"
                          }
                          focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword[field] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors[field] && (
                      <p className="mt-1 text-sm text-red-600 animate-shake">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Modified Roles section for single selection */}
              <div
                className={`transform transition-all duration-300 ${
                  currentField === "roles" ? "scale-105" : ""
                }`}
              >
                <div className="relative">
                  <label
                    htmlFor="roles"
                    className={`block text-sm font-medium transition-colors duration-300 ${
                      currentField === "role"
                        ? "text-green-600"
                        : "text-gray-700"
                    }`}
                  >
                    Select Role
                  </label>
                  <select
                    id="roles"
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                    onFocus={() => handleFocus("roles")}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full px-4 py-3 border-2 rounded-lg shadow-sm 
        transition-all duration-300 ease-in-out appearance-none
        ${
          currentField === "role"
            ? "border-green-500 ring-2 ring-green-200"
            : "border-gray-200 hover:border-green-300"
        }
        focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200`}
                  >
                    <option value="">Select a role</option>
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 animate-shake">
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent 
                  rounded-lg text-white text-lg font-semibold
                  transition-all duration-300 ease-in-out
                  transform hover:scale-105 hover:shadow-lg
                  ${
                    isLoading
                      ? "bg-green-400 cursor-wait"
                      : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Sign up"
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an Account?{" "}
                  <Link to="/auth/login">
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-500 font-medium"
                    >
                      Login
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Signup;
