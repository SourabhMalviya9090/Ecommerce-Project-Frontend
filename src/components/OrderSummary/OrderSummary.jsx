import React, { useContext } from 'react'
import "./OrderSummary.css"
import { ShopContext } from '../../context/ShopContext'
import { Link } from 'react-router-dom'
import easyinvoice from "easyinvoice";
import logo from "../Assets/logo.png"
import emailjs from '@emailjs/browser'

// Order summary component
const OrderSummary = () => {
  const { getTotalCartAmount, all_products, cartItems, removeFromcart } = useContext(ShopContext);

  // Maintaing a local storage variable for checking about payment status to update orders page
  const paymentDone = localStorage.getItem("paymentDone");

  // Function to get products from cart to make a invoice of products after payment
  const getProductsForInvoice = () => {
    let cartForInvoice = [];
    for (let items of all_products) {
      if (cartItems[items.id] > 0) {
        cartForInvoice.push({ ...items, quantity: cartItems[items.id] });
      }
    }
    return cartForInvoice;
  }

  // Function for fetching the user from backend/database 
  const getUser = async () => {
    let userInfo;
    await fetch("http://localhost:4000/getuser", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`
      }
    }).then((res) => res.json()).then((data) => {
      userInfo = data.user;
    })
    return userInfo;
  }

  // Function to send an Email invoice to user after payment completion and booking of product
  const sendEmail = (user) => {
    const templateParams = {
      from_name: "Shoppers Ecommerce",
      from_email: 'shoppersecommerce72@gmail.com',
      to_name: `${user.name}`,
      to_email: `${user.email}`,
      message: `Your Order Has been places successfully! You can get the invoice and other details from "YourOrders" section from our Shoppers Website`

    };
    emailjs.send('service_3t4aebc', 'template_6rj4rtx', templateParams, '5zZnPUVTiFLWVDEyh')
      .then((result) => {
      }, (error) => {
        console.log(error.text);
      });

  }

  // Wrapper Function for send email function 
  const generateEmail = async () => {
    const user = await getUser();
    sendEmail(user);
  }

  // Function for downloading the Invoice pdf from Your Orders page
  const downloadInvoice = async () => {
    try {
      const InvoiceCart = getProductsForInvoice();
      const userInfo = await getUser();
      const productsArray = InvoiceCart.map((ele) => {
        return {
          quantity: ele.quantity,
          description: ele.name,
          tax: 0,
          price: ele.new_price,
        }
      })
      const data = {
        documentTitle: "INVOICE", //Defaults to INVOICE
        currency: "USD",
        taxNotation: "gst", //or gst
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        images: {
          // The logo on top of our invoice
          logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
        },
        sender: {
          company: "Shopper Ecommerce Platform",
          address: "31/10/12 C.R.P Line, Indore, M.P.",
          zip: "10011",
          city: "Indore",
          country: "India",
        },
        client: {
          company: `${userInfo.name}`,
          address: `${userInfo.email}`,
          zip: "1002, Walmart street",
          city: `Paymanet Done through - Stripe Gateway`,
          country: `Vendor - Shopper`,
        },
        invoiceNumber: `${InvoiceCart[0].id}`,
        invoiceDate: Date.now,
        products: productsArray,
        bottomNotice:
          "This is a system generated invoice for you purchase. Happy Shopping.",
      };
      const result = await easyinvoice.createInvoice(data);
      easyinvoice.download(`${userInfo.name}_Invoice.pdf`, result.pdf);
    } catch (err) {
      console.log(err);
    }

    // generate a user email also
    generateEmail();
  };

  return (
    <div className='cartItems'>
      <h2 style={{ color: "green", textAlign: "center" }}>Your Orders Summary</h2>
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Payment</p>
      </div>
      <hr />
      {all_products.map((e) => {
        if (cartItems[e.id] > 0) {
          return (<div>
            <div className="cartitems-format cartitems-format-main">
              <img src={e.image} alt="" className='carticon-product-icon' />
              <p>{e.name}</p>
              <p>${e.new_price}</p>
              <button className='cartitems-quantity'>{cartItems[e.id]}</button>
              <p>${e.new_price * cartItems[e.id]}</p>
              <p> {paymentDone === "1" ? <h4 style={{ color: "green" }}>Done &#9989;</h4> : <h4 style={{ color: "red" }}>Complete Payment</h4>}</p>
            </div>
            <hr />
          </div>);
        }
      })
      }
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>{paymentDone === "1" ? "Total Amount Paid " : "Total Amount"}</h1>
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
          {paymentDone === "1" ? <button onClick={downloadInvoice}>GET INVOICE </button> : <Link to={"/cart"}><button>Checkout</button></Link>}
        </div>
        <div className="cartitems-promocode">
          <p>Hey! Checkout More Products here...</p>
          <div className="cartitems-promobox">
            <Link to={"/"}>
              <button>Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OrderSummary
