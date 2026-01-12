import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, wishlist } = useProduct();

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/products" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent hover:from-cyan-300 hover:to-cyan-400 transition-all">
              ShopHub
            </Link>
            <div className="hidden sm:flex gap-4 ml-4">
              <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-gray-200 hover:text-cyan-400 transition-colors font-medium">
                Dashboard
              </Link>
              <Link to="/cart" className="text-gray-200 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1">
                Cart <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
              </Link>
              <Link to="/wishlist" className="text-gray-200 hover:text-cyan-400 transition-colors font-medium flex items-center gap-1">
                Wishlist <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-gray-200 font-medium">{user?.username}</span>
                <button onClick={logout} className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-md">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm shadow-md">
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="sm:hidden flex justify-around pb-3 border-t border-slate-600 pt-2 mt-2">
          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-gray-200 hover:text-cyan-400 transition-colors text-sm">
            Dashboard
          </Link>
          <Link to="/cart" className="text-gray-200 hover:text-cyan-400 transition-colors text-sm">
            Cart ({cart.length})
          </Link>
          <Link to="/wishlist" className="text-gray-200 hover:text-cyan-400 transition-colors text-sm">
            Wishlist ({wishlist.length})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
