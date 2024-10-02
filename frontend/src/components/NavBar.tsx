import { FunctionComponent, useState , memo } from "react";
import { Link } from "react-router-dom";

const Navbar: FunctionComponent = memo(() => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-100 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-extrabold text-pink-600">
              brevity
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link
              to="/contribute"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contribute
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-600 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Main menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/contribute"
            className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Contribute
          </Link>
          <Link
            to="/login"
            className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-700 hover:text-pink-600 block px-3 py-2 rounded-md text-base font-medium"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;