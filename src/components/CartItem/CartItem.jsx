import React, { useContext, useState } from 'react'
import "./CartItem.css"
import { ShopContext } from '../../context/ShopContext'
import remove_icon from "../Assets/cart_cross_icon.png"
import {loadStripe} from '@stripe/stripe-js';
import emailjs from '@emailjs/browser'

const CartItem = () => {
  const{getTotalCartAmount,all_products, cartItems, removeFromcart} = useContext(ShopContext);
 
  // Getting products from cart to generate a payment of products
  const makeProductFromCart = ()=>{
    let cartForPayment =[];
    for(let items of all_products){
      if(cartItems[items.id]>0){
        cartForPayment.push({...items, quantity: cartItems[items.id]});
      }
    }
    return cartForPayment;
  }

  // Payment function for checkout button 
  const payment = async()=>{
    const stripe = await loadStripe('pk_test_51PSHvrRqGoXTbAR2JrrgE0QEvjgZUhDV9YXqYHZUpzIbsGjPFdpawKZZHxNrc3pCy6FaGMobpgrMqOIowL3Av2XS00HrwOsYZD');
    const getProducts = makeProductFromCart();
    const body= {
      cartProducts: getProducts
    }
    const headers = {
      "Content-Type": 'application/json'
    }
    const res = await fetch(`http://localhost:4000/create-checkout-session`,{
      method:"POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    const session = await res.json();
    const result  = stripe.redirectToCheckout({
      sessionId: session.id
    })
    localStorage.setItem("paymentDone","1");
    if(result.error){
      console.log(result.error);
    }
  }
  return (
    <div className='cartItems'>
        <div className="cartitems-format-main">
            <p>Product</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
      <hr />
      {all_products.map((e)=>{
        if(cartItems[e.id]>0){
            return (<div>
            <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt=""  className='carticon-product-icon'/>
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>${e.new_price*cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} alt=""  onClick={()=> removeFromcart(e.id)}/>
            </div>
            <hr />
            </div>);
        }
      })
      }
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={()=>{payment()}}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promocode, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder='promo-code'/>
            <button>Apply</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default CartItem
