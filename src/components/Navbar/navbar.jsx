import React, { useState } from 'react'
import "./navbar.css"
import logo from "../Assets/logo.png"
import cart_icon from "../Assets/cart_icon.png"
import { Link } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import { useContext } from 'react'
import { useRef } from 'react'
import drop_down from "../Assets/nav_dropdown_icon.webp"

const Navbar = () => {

  // Maintaining a state for menu slider 
  const [menu, setmenu] = useState('shop');

  const { countCartItems } = useContext(ShopContext);

  const menuRef = useRef();

  // Function for dropdown icon in mobile view
  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }
  
  // Function for user logout for logout button
  const logoutFunc = () => {
    localStorage.removeItem("auth-token");
    window.location.replace("/Login")
  }

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="loading.." />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={drop_down} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => { setmenu('shop') }}><Link style={{ textDecoration: "none" }} to="/"> Shop {menu === 'shop' ? <hr /> : ""} </Link></li>
        <li onClick={() => { setmenu('mens') }}><Link style={{ textDecoration: "none" }} to="/mens">Men {menu === 'mens' ? <hr /> : ""}</Link></li>
        <li onClick={() => { setmenu('womens') }}><Link style={{ textDecoration: "none" }} to="/womens">Women {menu === 'womens' ? <hr /> : ""} </Link></li>
        <li onClick={() => { setmenu('kids') }}><Link style={{ textDecoration: "none" }} to="/kids">Kids {menu === 'kids' ? <hr /> : ""} </Link></li>
        <li onClick={() => { setmenu('your-orders') }}><Link style={{ textDecoration: "none" }} to="/YourOrders">My Orders {menu === 'your-orders' ? <hr /> : ""} </Link></li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem("auth-token") ? <button> <Link style={{ textDecoration: "none" }} onClick={() => { logoutFunc() }}>Logout </Link></button> : <button> <Link style={{ textDecoration: "none" }} to="/Login">Login </Link></button>}
        <Link style={{ textDecoration: "none" }} to={localStorage.getItem("auth-token") ? "/cart" : "/Login"}><img src={cart_icon} alt="loading.." /></Link>
        <div className="nav-cart-count">{countCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;
