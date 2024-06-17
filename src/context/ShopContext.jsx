import React, { createContext, useState } from "react";
import all_products from "../components/Assets/all_product";
import CartItem from "../components/CartItem/CartItem";
import { useEffect } from "react";
import emailjs from '@emailjs/browser'

// Creating a context for sharing to all the components
export const ShopContext = createContext(null);


// Function to generate a default empty cart
const getDefaultCart = () => {
    const cart = {};
    for (let index = 0; index < all_products.length + 1; index++) {
        cart[index] = 0;
    }
    return cart;
}

export const ShopContextProvider = (props) => {

    // Maintaining a state for cart items
    const [cartItems, setCart] = useState(getDefaultCart());

    // Function for retriveing the user cart after user logs in 
    const retrieveCart = async () => {
        if (localStorage.getItem("auth-token") !== "") {
            await fetch("https://ecommerce-project-backend-109a.onrender.com/getusercart", {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": 'application/json'
                },
            }).then((res) => res.json()).then((data) => {
                setCart(data);
            })
        }
    }

    useEffect(() => {
        retrieveCart();
    }, []);

    // Add to cart function 
    const addToCart = async (itemId) => {
        const newCart = { ...cartItems, [itemId]: cartItems[itemId] + 1 };
        setCart(newCart);
        if (localStorage.getItem('auth-token') !== "") {
            await fetch("https://ecommerce-project-backend-109a.onrender.com/addtocart", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    "auth-token": `${localStorage.getItem('auth-token')}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ id: itemId })
            }).then((res) => res.json()).then((data) => {
                console.log(data);
            })
        }
        localStorage.setItem("paymentDone", "0");
    }

    // Remove from function
    const removeFromcart = async (itemId) => {
        const newCart2 = { ...cartItems, [itemId]: cartItems[itemId] - 1 };
        setCart(newCart2);
        if (localStorage.getItem("auth-token") != "") {
            await fetch("https://ecommerce-project-backend-109a.onrender.com/removefromcart", {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "auth-token": `${localStorage.getItem("auth-token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: itemId })
            }).then((res) => res.json).then((data) => {
                console.log(data);
            })
        }

    }

    // Function for calculating the total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (let items in cartItems) {
            if (cartItems[items] > 0) {
                totalAmount += (all_products.find((ele) => ele.id === Number(items)).new_price) * (cartItems[items]);
            }
        }
        return totalAmount;
    }

    // Function for geting the total number of products inside the cart
    const countCartItems = () => {
        let count = 0;
        for (let items in cartItems) {
            if (cartItems[items] > 0) {
                count += cartItems[items];
            }
        }

        return count;

    }


    // Exporting the states and utility functions for other components to use
    const contextVal = { countCartItems, getTotalCartAmount, all_products, cartItems, addToCart, removeFromcart };

    return (
        <ShopContext.Provider value={contextVal}>
            {props.children}
        </ShopContext.Provider>
    );

}