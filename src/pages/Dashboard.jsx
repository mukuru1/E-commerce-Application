import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!newTitle.trim()) return toast.error("Enter a product title");

    try {
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      const data = await res.json();
      setProducts([data, ...products]);
      setNewTitle("");
      toast.success("Product added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle }),
      });

      const updated = await res.json();

      setProducts(
        products.map((p) => (p.id === editingProduct.id ? updated : p))
      );
      setEditingProduct(null);
      setEditedTitle("");
      toast.success("Product updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async () => {
    try {
      await fetch(`https://dummyjson.com/products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      toast.success("Product deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditedTitle(product.title);
  };

  const openDelete = (product) => {
    setDeletingProduct(product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800">Product Dashboard</h1>

        {!isAuthenticated ? (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <p className="mb-3 text-slate-600 font-medium">You must be logged in to manage products.</p>
            <Link to="/login" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200">
              Login to continue
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Product</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter product title"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                onClick={addProduct}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
              >
                Add Product
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
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
                  <h2 className="font-bold text-lg mb-4 text-slate-800 line-clamp-2 flex-1">{p.title}</h2>
                  <div className="flex gap-2">
                  {isAuthenticated ? (
                    <>
                      <button
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                        onClick={() => openEdit(p)}
                        title="Edit product"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                        onClick={() => openDelete(p)}
                        title="Delete product"
                      >
                        <FiTrash size={18} />
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-slate-500 text-center w-full py-2">Login to edit</span>
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
                Are you sure you want to delete <span className="font-semibold text-slate-800">{deletingProduct.title}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setDeletingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
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
