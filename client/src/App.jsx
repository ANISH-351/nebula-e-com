import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './components/home/product';
import ProductDashboard from './components/DashBoard/ProductDashboard';
import CategoryDashboard from './components/DashBoard/CategoryDashboard';
import BannerDashboard from './components/DashBoard/BannerDashboard';
import Header from './components/Header/Header';
import Banner from './components/home/Banner';
import Category from './components/home/Category';
import NewArrival from './components/home/NewArrival';
import Addsection from './components/home/Addsection';
import FeaturedProducts from './components/home/FeaturedProducts';
import Footer from './components/Footer/Footer';
import ProductDetails from './components/ProductDetail/ProductDetail';
import Cart from './components/cart/Cart';
import Checkout from './components/Checkout/Checkout';
import CategoryPage from './components/Category/CategoryPage';
import Wishlist from './components/Wishlist/Wishlist';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/"
         element={<>
        
        <Banner/>
      
        <Category/>
        <NewArrival/>
        <Addsection/>
        <FeaturedProducts/>
       

        
        </>} />

         <Route path="/product-detail" element={<ProductDetails/>} />

           <Route path="/cart" element={<Cart/>} />

            <Route path="/checkout" element={<Checkout/>} />

             <Route path="/category" element={<CategoryPage/>} />

            <Route path="/wishlist" element={<Wishlist/>} />

        <Route path="/product-dashboard" element={<ProductDashboard/>} />
         <Route path="/category-dashboard" element={<CategoryDashboard/>} />
         <Route path="/banner-dashboard" element={<BannerDashboard/>} />
      </Routes>
       <Footer/>
    </BrowserRouter>
  );
}

export default App;