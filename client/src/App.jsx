import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);
  }, []);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-green-600 text-lg font-medium animate-pulse">Loading form...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-center gap-5 flex-col w-96 mx-auto items-center h-screen">
        <h1 className="text-[25px] text-center">Welcome </h1>{" "}
        <Link to={"/auth/login"}>
          <button className="w-[300px] border-solid border-2 border-green-500 py-2 rounded-lg">
            Get Started
          </button>
        </Link>
      </div>
    </>
  )
}

export default App
