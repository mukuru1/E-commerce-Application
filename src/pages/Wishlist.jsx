import { useProduct } from "../context/ProductContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useProduct();

  if (wishlist.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">♥</div>
          <p className="text-2xl text-slate-600 font-medium">Your wishlist is empty</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col sm:flex-row gap-4">
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">{product.title}</h2>
                  <p className="text-lg text-cyan-600 font-semibold">${product.price}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Remove
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

export default Wishlist;
