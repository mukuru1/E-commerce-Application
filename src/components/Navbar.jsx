import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart, wishlist } = useProduct();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/products" className="font-bold">E-Commerce</Link>
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="">Dashboard</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
        <Link to="/wishlist">Wishlist ({wishlist.length})</Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-4">{user?.username}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-green-500 px-2 py-1 rounded hover:bg-green-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
