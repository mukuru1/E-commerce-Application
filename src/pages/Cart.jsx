import { useProduct } from "../context/ProductContext";

const Cart = () => {
  const { cart, removeFromCart } = useProduct();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0)
    return <div className="p-6 text-center text-xl">Your cart is empty.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cart.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow flex gap-4">
            <img
              src={product.thumbnail || product.images?.[0]}
              alt={product.title}
              className="w-32 h-32 object-cover rounded"
            />
            <div className="flex flex-col justify-between">
              <h2 className="text-lg font-bold">{product.title}</h2>
              <p className="text-gray-700">Price: ${product.price}</p>
              <p className="text-gray-700">Quantity: {product.quantity}</p>
              <button
                onClick={() => removeFromCart(product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-bold">
        Total: ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
};

export default Cart;
