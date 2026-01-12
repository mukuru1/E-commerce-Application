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
    return <div className="flex items-center justify-center min-h-screen"><div className="text-center text-xl text-slate-600 font-medium">Loading products...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800">Discover Products</h1>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-cyan-500 text-white shadow-md"
                  : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
              }`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === cat.slug
                    ? "bg-cyan-500 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            >
              <option value="">Sort By</option>
              <option value="price">Price</option>
              <option value="title">Title</option>
              <option value="rating">Rating</option>
            </select>

            <select
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 && (
            <p className="text-center col-span-full text-slate-500 py-12">
              No products found.
            </p>
          )}

          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={product.thumbnail || product.images?.[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-800 truncate mb-2">{product.title}</h2>
                <p className="text-2xl font-bold text-cyan-600 mb-4">${product.price}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => addToWishlist(product)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
