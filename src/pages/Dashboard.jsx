import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dashboardProducts")) || [];
    setProducts(stored);
  }, []);

  
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/products?limit=0");
      const data = await res.json();
      setAllProducts(data.products || []);
      
      const stored = JSON.parse(localStorage.getItem("dashboardProducts")) || [];
      if (stored.length === 0) {
        const initial = data.products.slice(0, 12); 
        setProducts(initial);
        localStorage.setItem("dashboardProducts", JSON.stringify(initial));
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

 
  useEffect(() => {
    localStorage.setItem("dashboardProducts", JSON.stringify(products));
  }, [products]);

  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    if (!sortBy) return;
    const sorted = [...products].sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        return sortOrder === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
      }
    });
    setProducts(sorted);
  }, [sortBy, sortOrder]);

  
  const addProduct = (product) => {
    if (products.find((p) => p.id === product.id)) {
      toast.error("Product already added!");
      return;
    }
    setProducts([product, ...products]);
    toast.success("Product added to dashboard!");
  };

  
  const openEdit = (product) => {
    setEditingProduct(product);
    setEditedTitle(product.title);
  };

  const saveEdit = () => {
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...p, title: editedTitle } : p
      )
    );
    setEditingProduct(null);
    setEditedTitle("");
    toast.success("Product updated!");
  };

  const openDelete = (product) => setDeletingProduct(product);

  const deleteProduct = () => {
    setProducts(products.filter((p) => p.id !== deletingProduct.id));
    setDeletingProduct(null);
    toast.success("Product deleted!");
  };

 
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<AiFillStar key={i} className="text-amber-400" size={16} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <AiOutlineStar className="absolute text-amber-400" size={16} />
            <div className="absolute overflow-hidden w-2 h-4">
              <AiFillStar className="text-amber-400" size={16} />
            </div>
          </div>
        );
      } else {
        stars.push(<AiOutlineStar key={i} className="text-amber-400" size={16} />);
      }
    }
    return stars;
  };

  
  const filteredProducts = allProducts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-800">
          Product Dashboard
        </h1>

        {!isAuthenticated ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <p className="mb-3 text-slate-600 font-medium">
              You must be logged in to manage products.
            </p>
            <Link
              to="/login"
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Login to continue
            </Link>
          </div>
        ) : (
          <>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Search Products
              </h2>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center p-2 bg-slate-50 rounded-lg shadow-sm"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {p.title}
                        </span>
                        <button
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200"
                          onClick={() => addProduct(p)}
                        >
                          Add
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No products found</p>
                  )}
                </div>
              )}
            </div>

            
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Sort Products</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSort("rating")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === "rating"
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {sortBy === "rating"
                    ? sortOrder === "asc"
                      ? "⬆ Rating"
                      : "⬇ Rating"
                    : "Rating"}
                </button>
                <button
                  onClick={() => handleSort("price")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === "price"
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {sortBy === "price"
                    ? sortOrder === "asc"
                      ? "⬆ Price"
                      : "⬇ Price"
                    : "Price"}
                </button>
                <button
                  onClick={() => handleSort("title")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    sortBy === "title"
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {sortBy === "title"
                    ? sortOrder === "asc"
                      ? "⬆ Title (A-Z)"
                      : "⬇ Title (Z-A)"
                    : "Title"}
                </button>
                {sortBy && (
                  <button
                    onClick={() => {
                      setSortBy("");
                      setSortOrder("asc");
                    }}
                    className="px-4 py-2 rounded-lg font-medium bg-slate-400 text-white hover:bg-slate-500 transition-all duration-200"
                  >
                    Clear Sort
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                {p.thumbnail && (
                  <div className="w-full h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-bold text-lg mb-2 text-slate-800 line-clamp-2">
                    {p.title}
                  </h2>
                  {p.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">{renderStars(p.rating)}</div>
                      <span className="text-sm font-semibold text-slate-700">
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 flex-1">
                    {isAuthenticated ? (
                      <>
                        <button
                          className="flex-1 h-10 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm"
                          onClick={() => openEdit(p)}
                          title="Edit product"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="flex-1 h-10 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm"
                          onClick={() => openDelete(p)}
                          title="Delete product"
                        >
                          <FiTrash size={16} />
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500 text-center w-full py-2">
                        Login to edit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Edit Product</h2>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={saveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        
        {deletingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Delete Product</h2>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  {deletingProduct.title}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setDeletingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={deleteProduct}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
