import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import ProductDashboard from './components/DashBoard/ProductDashboard';
import CategoryDashboard from './components/DashBoard/CategoryDashboard';
import BannerDashboard from './components/DashBoard/BannerDashboard';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Banner from './components/home/Banner';
import Category from './components/home/Category';
import NewArrival from './components/home/NewArrival';
import Addsection from './components/home/Addsection';
import FeaturedProducts from './components/home/FeaturedProducts';

import ProductDetails from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import CategoryPage from './components/Category/CategoryPage';
import Wishlist from './components/Wishlist/Wishlist';
import Profile from './components/Profile/Profile';
import Address from './components/Profile/Address';
import ChangePassword from './components/Profile/ChangePassword';
   import { Login, Signup } from "./components/Auth/Auth";

import ScrollToTop from './components/ScrollToTop';

function App() {
  const location = useLocation();

  // hide header/footer for dashboard pages
  const isDashboard =
    location.pathname.includes('dashboard');

  return (
    <>
      <ScrollToTop />

      {!isDashboard && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Category />
              <NewArrival />
              <Addsection />
              <FeaturedProducts />
            </>
          }
        />

        <Route path="/product-detail/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/address" element={<Address />} />
        <Route path="/change-password" element={<ChangePassword />} />
     

<Route path="/login"  element={<Login />} />
<Route path="/signup" element={<Signup />} />





        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/category-dashboard" element={<CategoryDashboard />} />
        <Route path="/banner-dashboard" element={<BannerDashboard />} />
      
      </Routes>

      {!isDashboard && <Footer />}
    </>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}