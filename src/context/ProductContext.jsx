import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  // ✅ Fetch all categories safely
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/products/categories");
      // DummyJSON now returns array of objects [{ slug, name, url }]
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else if (Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  // ✅ Fetch products based on selected category, sort, order
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "/products";

      // category selection
      if (selectedCategory !== "all") {
        url = `/products/category/${selectedCategory}`;
      }

      // sorting
      const sortQuery = sortBy ? `?sortBy=${sortBy}&order=${order}` : "";
      const res = await axios.get(`${url}${sortQuery}`);

      const data = res.data.products || res.data;
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to fetch products");
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, order]);

  // ✅ Add to cart
  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      toast.error("Product already in cart");
      return;
    }
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Added to cart");
  };

  // ✅ Add to wishlist
  const addToWishlist = (product) => {
    if (wishlist.find((p) => p.id === product.id)) {
      toast.error("Product already in wishlist");
      return;
    }
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Added to wishlist");
  };

  // ✅ Remove from cart
  const removeFromCart = (id) => {
    const updatedCart = cart.filter((p) => p.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Removed from cart");
  };

  // ✅ Remove from wishlist
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((p) => p.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Removed from wishlist");
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        loading,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        order,
        setOrder,
        addToCart,
        addToWishlist,
        removeFromCart,
        removeFromWishlist,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
