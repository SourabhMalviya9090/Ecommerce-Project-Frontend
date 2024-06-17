import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/navbar';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom'
import Shop from './pages/Shop'
import Login from './pages/LoginSignup'
import ShopCategory from './pages/ShopCategory'
import Product from './pages/Product'
import Cart from './pages/Cart'
import LoginSignup from './pages/LoginSignup';
import Footer from "./components/Footer/Footer"
import men_banner from "./components/Assets/banner_mens.png"
import women_banner from "./components/Assets/banner_women.png"
import kids_banner from "./components/Assets/banner_kids.png"
import OrderSummary from './components/OrderSummary/OrderSummary';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
        <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
        <Route path="/kids" element={<ShopCategory banner={kids_banner} category="kid" />} />
        <Route path="/products" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path='/cart' element={<Cart />} />
        <Route path='/Login' element={<LoginSignup />} />
        <Route path='/YourOrders' element={localStorage.getItem("auth-token") ? <OrderSummary /> : <LoginSignup />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
