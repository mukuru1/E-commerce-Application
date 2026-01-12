import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const getStoredUser = () => JSON.parse(localStorage.getItem("user")) || null;
  const cartKeyFor = (user) => (user && user.username ? `cart:${user.username}` : "cart:guest");
  const wishlistKeyFor = (user) => (user && user.username ? `wishlist:${user.username}` : "wishlist:guest");

  const loadCartFor = (user) => JSON.parse(localStorage.getItem(cartKeyFor(user))) || [];
  const loadWishlistFor = (user) => JSON.parse(localStorage.getItem(wishlistKeyFor(user))) || [];

  const [cart, setCart] = useState(() => loadCartFor(getStoredUser()));
  const [wishlist, setWishlist] = useState(() => loadWishlistFor(getStoredUser()));
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/products/categories");
  
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "/products";

      if (selectedCategory !== "all") {
        url = `/products/category/${selectedCategory}`;
      }

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
    const handleLogin = (e) => {
      const user = (e && e.detail && e.detail.user) || getStoredUser();
      setCart(loadCartFor(user));
      setWishlist(loadWishlistFor(user));
    };

    const handleLogout = () => {
      
      setCart(loadCartFor(null));
      setWishlist(loadWishlistFor(null));
    };

    window.addEventListener("user-login", handleLogin);
    window.addEventListener("user-logout", handleLogout);
    return () => {
      window.removeEventListener("user-login", handleLogin);
      window.removeEventListener("user-logout", handleLogout);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, order]);

  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      toast.error("Product already in cart");
      return;
    }
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    const user = getStoredUser();
    localStorage.setItem(cartKeyFor(user), JSON.stringify(updatedCart));
    toast.success("Added to cart");
  };

  const addToWishlist = (product) => {
    if (wishlist.find((p) => p.id === product.id)) {
      toast.error("Product already in wishlist");
      return;
    }
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    const user = getStoredUser();
    localStorage.setItem(wishlistKeyFor(user), JSON.stringify(updatedWishlist));
    toast.success("Added to wishlist");
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((p) => p.id !== id);
    setCart(updatedCart);
    const user = getStoredUser();
    localStorage.setItem(cartKeyFor(user), JSON.stringify(updatedCart));
    toast.success("Removed from cart");
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((p) => p.id !== id);
    setWishlist(updatedWishlist);
    const user = getStoredUser();
    localStorage.setItem(wishlistKeyFor(user), JSON.stringify(updatedWishlist));
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
