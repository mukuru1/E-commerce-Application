import { useProduct } from "../context/ProductContext";

const Products = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    order,
    setOrder,
    addToCart,
    addToWishlist,
    loading,
  } = useProduct();

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading products...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Products</h1>

      
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded ${
            selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          All
        </button>

        
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat.slug
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      
      <div className="flex gap-2 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Sort By</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length === 0 && (
          <p className="text-center col-span-full text-gray-600">
            No products found.
          </p>
        )}

        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-bold truncate">{product.title}</h2>
            <p className="text-gray-700">${product.price}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
