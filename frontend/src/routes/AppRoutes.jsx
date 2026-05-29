import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import AdminProductEdit from "../pages/AdminProductEdit";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import Wishlist from "../pages/Wishlist";
import Category from "../pages/Category";
import AllCategories from "../pages/AllCategories";
import HelpCenter from "../pages/HelpCenter";
import NotificationPreferences from "../pages/NotificationPreferences";
import Rewards from "../pages/Rewards";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/categories" element={<AllCategories />} />
      <Route path="/category/:name" element={<Category />} />

      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/helpcenter" element={<HelpCenter />} />
      <Route path="/notifications" element={<NotificationPreferences />} />
      <Route path="/rewards" element={<Rewards />} />

      {/* Protected routes temporarily removed (fix blank page issue) */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/product/:id/edit" element={<AdminProductEdit />} />
    </Routes>
  );
};

export default AppRoutes;