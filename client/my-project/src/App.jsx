import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './components/home/product';
import ProductDashboard from './components/DashBoard/ProductDashboard';
import CategoryDashboard from './components/DashBoard/CategoryDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/product-dashboard" element={<ProductDashboard/>} />
         <Route path="/category-dashboard" element={<CategoryDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;