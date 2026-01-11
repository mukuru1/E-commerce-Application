import { useState, useEffect } from "react";
import { useProduct } from "../context/ProductContext";

const Dashboard = () => {
  const { products: allProducts, fetchProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dashboardProducts")) || allProducts;
    setProducts(stored);
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem("dashboardProducts", JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    if (!newTitle) return;
    const newProduct = { id: Date.now(), title: newTitle };
    setProducts([newProduct, ...products]);
    setNewTitle("");
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setEditedTitle(p.title);
  };

  const saveEdit = () => {
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...p, title: editedTitle } : p
      )
    );
    setEditingProduct(null);
    setEditedTitle("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Add Product */}
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

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow flex flex-col">
            <h2 className="font-bold">{p.title}</h2>
            <div className="mt-2 flex gap-2">
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
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
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
