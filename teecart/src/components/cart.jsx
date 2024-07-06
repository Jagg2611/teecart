import React, { useEffect, useState } from "react";
import "../stylings/cart.css";
import {
  COLLECTION_ITEMLOG,
  DATABASEID,
  database,
} from "../Config/appwriteConfig";
import { Query } from "appwrite";
import { useAuth } from "../utils/AuthContext";
import Loader from "./loader";
import delete_icon from '../assets/delete.png'
import { faL } from "@fortawesome/free-solid-svg-icons";
const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const calculateTotalPrice = (items) => {
    // setIsLoading(true)
    if (items) {
      const total = items.reduce((acc, item) => {
        return acc + item.Quantity * item.product.price;
      }, 0);
      setTotalPrice(total.toFixed(2)); // Format to two decimal places
    }
    // setIsLoading(false)
  };
  const changeCartItem = async(index,q)=>{
    await database.updateDocument(
        DATABASEID,
        COLLECTION_ITEMLOG,
        cartItems[index].$id,
        {
            Quantity: cartItems[index].Quantity+q,
        }
    )
  }
  const increaseQuantity = (index) => {
    if (cartItems[index].Quantity !== 20) {
      setIsLoading(true);
      const newCartItems = [...cartItems]; // Create a new array
      newCartItems[index] = {
        ...newCartItems[index], // Copy the existing item properties
        Quantity: newCartItems[index].Quantity + 1, // Update the quantity
      };
      setCartItems(newCartItems); // Update the state
      setIsLoading(false);
      calculateTotalPrice(newCartItems);
      changeCartItem(index,1);
    }
  };

  const decreaseQuantity = (index) => {
    if (cartItems[index].Quantity !== 1) {
      setIsLoading(true);
      const newCartItems = [...cartItems]; // Create a new array
      newCartItems[index] = {
        ...newCartItems[index], // Copy the existing item properties
        Quantity: newCartItems[index].Quantity - 1, // Update the quantity
      };
      setCartItems(newCartItems);
       // Update the state
       calculateTotalPrice(newCartItems);
      setIsLoading(false);
      changeCartItem(index,-1);
    }
  };

  const deleteItem = async (index) => {
    setIsLoading(true);
    const newCartItems = cartItems.filter((_, i) => i !== index); // Create a new array excluding the item
    setCartItems(newCartItems);
    
    setIsLoading(false);
    calculateTotalPrice(newCartItems);
    await database.deleteDocument(
      DATABASEID,
      COLLECTION_ITEMLOG,
      cartItems[index].$id
    )
  };
  const getCartItems = async () => {
    await database
      .listDocuments(DATABASEID, COLLECTION_ITEMLOG, [
        
        Query.and([
          Query.equal("profile",user.$id),
          Query.equal("order",false)
        ])
      ])
      .then((promise) => {
        console.log("mycart,", promise);
        setCartItems(promise.documents);
        calculateTotalPrice(promise.documents);
 
      });
    setIsLoading(false);
    
  };
  useEffect(() => {
    

    getCartItems();
  }, []);

  const buy_now = async()=>{
    for(let i=0;i<cartItems.length;i++){
      await database.updateDocument(
        DATABASEID,
        COLLECTION_ITEMLOG,
        cartItems[i].$id,
        {
          'order':true
        }
      )
    }
    setIsLoading(true);
    getCartItems();
    setIsLoading(false)
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="heading">
          <h1>shopping cart</h1>
        </div>
        <table className="cart-table">
          <thead>
            <tr>
              <th className="product-column">Product</th>
              <th className="size-column">Size</th>
              <th className="quantity-column">Quantity</th>
              <th className="total-column">Total Cost</th>
              <th className="cancel-column">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className="product-column">
                  <div className="cart-product">
                    <div className="cart-product-image">
                      <img src={item.product.images[0]} alt="" />
                    </div>
                    <div className="cart-product-name">
                      <h1>
                        {item.product.name} <br />
                        <span>original</span>{" "}
                      </h1>
                    </div>
                  </div>
                </td>
                <td className="size-column">{item.size}</td>
                <td className="quantity-column">
                  <div className="cart-quantity">
                    <div className="product-quantitiy">
                      <div className="increment-decrement">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            decreaseQuantity(index);
                          }}
                        >
                          -
                        </button>
                      </div>
                      <input
                        name={`quantity-${item.$id}`}
                        id={`quantity-${item.$id}`}
                        value={item.Quantity}
                        readOnly
                      />
                      <div className="increment-decrement">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            increaseQuantity(index);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="total-column">
                  <div className="cart-price">
                    Rs.{(item.Quantity * item.product.price).toFixed(2)}
                  </div>
                </td>
                <td className="cancel-column">
                  <div
                    className="cart-cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteItem(index);
                    }}
                  >
                    <img src={delete_icon} alt="" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="payment-info">
        <div className="heading">
          <h1>payment info</h1>
          <h1>Order summary</h1>
          <div className="subtotal-section">
            <div className="subtotal-row">
              <p>order subtotal</p>
              <p>Rs.{totalPrice}</p>
            </div>
            <div className="subtotal-row">
              <p>sgst</p>
              <p>2.5%: {((totalPrice * 2.5) / 100).toFixed(2)}</p>
            </div>
            <div className="subtotal-row">
              <p>cgst</p>
              <p>2.5%: {((totalPrice * 2.5) / 100).toFixed(2)}</p>
            </div>
            <hr className="line" />
            <div className="subtotal-row">
              <p>Total</p>
              <p>{((totalPrice * 105) / 100).toFixed(2)}</p>
            </div>
            <div className="buy-now">
              <button onClick={(e)=>{e.preventDefault();buy_now()}}>Buy now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
