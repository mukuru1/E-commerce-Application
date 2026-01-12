import { useProduct } from "../context/ProductContext";

const Cart = () => {
  const { cart, removeFromCart } = useProduct();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-2xl text-slate-600 font-medium">Your cart is empty</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-slate-800">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((product) => (
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
                    <p className="text-slate-600 mt-1">Quantity: {product.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="mt-4 sm:mt-0 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium self-start"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Order Summary</h2>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600 mb-2">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-bold text-slate-800">
                  <span>Total</span>
                  <span className="text-cyan-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-md">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
