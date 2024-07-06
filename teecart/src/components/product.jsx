import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../stylings/product.css";
import plus from "../assets/plus.png";
import minus from "../assets/minus.png";
import { COLLECTION_ITEMLOG, COLLECTION_PROFILES, DATABASEID, database } from "../Config/appwriteConfig";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/AuthContext";
import { Query } from "appwrite";

const Product = () => {
  const {user} = useAuth()
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state;
  productData.sizes = ['XS','S','M','L','XL']
  const [selectedImage, setSelectedImage] = useState(productData.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [size,setSize] = useState('XS');

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const increaseQuantity = ()=>{
    if(quantity!==10){
      setQuantity(quantity+1);
    }
  }

  const decreaseQuantity = ()=>{
    if(quantity!==1){
      setQuantity(quantity-1);
    }
  }

 

  // const handleSizeChange = (event) => {
  //   setSelectedSize(event.target.value);
  // };
  const createAndAdd = async(profileData)=>{
    console.log('check while adding',profileData)
    const currentDatetime = new Date();
    const promise = await database.createDocument(
      DATABASEID,
      COLLECTION_ITEMLOG,
      'unique()',
      {
        Quantity: quantity,
        created_at: currentDatetime.toLocaleString(),
        product: productData.$id,
        order: false,
        profile: profileData.$id,
        size: size
      }
    )
    console.log(promise);
  }

  const updateAndAdd = async(itemlogid)=>{
    database.updateDocument(
      DATABASEID,
      COLLECTION_ITEMLOG,
      itemlogid.$id,
      {
        Quantity: itemlogid.Quantity+1,
      }
    )
  }
  
  const checkAndAdd = async(profileData)=>{
    console.log('check in checkandAdd', profileData)
    await database.listDocuments(
      DATABASEID,
      COLLECTION_ITEMLOG,
      [
        Query.equal('profile',user.$id)
      ]
    ).then(
      (promise)=>{
        let itemlogid = null;
        for(let i=0;i<promise.documents.length;i++){
          console.log(promise.documents[i].product.$id, productData.$id)
          if(promise.documents[i].product.$id===productData.$id && promise.documents[i].size === size && promise.documents[i].order===false ){
            itemlogid = promise.documents[i]
          }
        }
        if(itemlogid){
          console.log('updating');
           updateAndAdd(itemlogid);
        }
        else{
          console.log('adding new');
          createAndAdd(profileData);
        }
      }
    )
  }

  const addToCart = async() => {
    const currentDatetime = new Date();
    if(!user){
      navigate('/login')
    }
    
    console.log("Adding to cart:", productData.$id, quantity, size);
    // Implement logic to add product to cart (e.g., using Redux, Context API, or local storage)
    await database.getDocument(
      DATABASEID,
      COLLECTION_PROFILES,
      user.$id,
    ).then(
      (profileData)=>{
        checkAndAdd(profileData)
      }
    )
    
      
    
  };

  return (
    <div className="product-page">
      <div className="product-images">
        <div className="thumbnails">
          {productData.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={productData.name + " - Thumbnail " + (index + 1)}
              className={
                image === selectedImage ? "thumbnail active" : "thumbnail"
              }
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
        <div className="main-image">
          <img src={selectedImage} alt={productData.name} />
        </div>
      </div>
      <div className="product-details">
        <h1>{productData.name}</h1>
        <p>{productData.description}</p>
        <p className="price"><span>Rs.</span>{productData.price}/-</p>
        <div className="product-options">
          
          <div className="product-quantitiy">
          <label htmlFor="quantity">Quantity:</label>
            <div className="increment-decrement">
              <button type="button" onClick={decreaseQuantity}>-</button>
            </div>
            <input name={`quantity-${productData.$id}`} id={`quantity-${productData.$id}`} value={quantity} readOnly/>
            <div className="increment-decrement">
              <button type="button" onClick={increaseQuantity}>+</button>
            </div>
          </div>
          <div className="product-sizes">
          <label htmlFor="size">Size:</label>
          <select id="size" onChange={(e)=>{setSize(e.target.value)}}>
            {productData.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          </div>
        </div>
        
        <div className="add-to-cart">
        <button onClick={addToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Product;
