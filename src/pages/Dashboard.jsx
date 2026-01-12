import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import toast from "react-hot-toast";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
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

  
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(`https://dummyjson.com/products/${id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((p) => p.id !== id));
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {!isAuthenticated ? (
        <div className="mb-4">
          <p className="mb-2 text-red-600">You must be logged in to manage products.</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Login to continue
          </Link>
        </div>
      ) : (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New product title"
            className="border p-2 rounded w-full"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            onClick={addProduct}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded shadow flex flex-col">
              <h2 className="font-bold text-lg mb-2">{p.title}</h2>
              <div className="flex gap-2 mt-auto">
                {isAuthenticated ? (
                  <>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Login to edit</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <h2 className="text-xl font-bold mb-3">Edit Product</h2>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
