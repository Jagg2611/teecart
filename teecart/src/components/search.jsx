import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  COLLECTION_CATEGORIES,
  DATABASEID,
  database,
} from "../Config/appwriteConfig";
import "../stylings/search.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faBars,
  faTimes,
  faSearch,
  faSignInAlt,
  faSignOutAlt,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../utils/AuthContext";
import fast_delivery_icon from "../assets/fast-delivery.png";
import bag from "../assets/bag.png";
import recycle from "../assets/recycle.png";
import Loader from "./loader";
import google_play_store from "../assets/google-play.png";
import apple_play_store from "../assets/apple.png";

const Search = () => {
  const { user } = useAuth();
  const location = useLocation();
  const rcv_data = location.state;
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [showProducts, setShowProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const navigate = useNavigate();
  const loadProductPage=(index)=>{
    let dataToBeSent = showProducts[index];
    navigate('/product',{state:dataToBeSent})
  }

  useEffect(() => {
    const getCategories = async () => {
      setIsLoading(true);
      await database
        .listDocuments(DATABASEID, COLLECTION_CATEGORIES)
        .then((promise) => {
          setData(promise);
          let products = [];
          for (let i = 0; i < promise["documents"].length; i++) {
            products.push(...promise["documents"][i]["products"]);
          }
          console.log("products", products);
          setShowProducts(products);
        });
      setIsLoading(false);
    };
    if (!rcv_data) {
      getCategories();
    }
  }, []);
  if (isLoading) {
    return (
      <div className="search-container">
        <div className="search-input">
          <div className={`search-page-links ${isMenuOpen ? "open" : ""}`}>
            <a href="/" className="search-link">
              Home
            </a>
            <a href="#about" className="search-link">
              About
            </a>
          </div>
          <div className={`search-page-search ${isMenuOpen ? "open" : ""}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
              style={{
                transform: "translateX(-40px)",
                transition: "transform 0.3s ease",
                margin: "auto",
                fontSize: "25px",
                cursor: "pointer",
              }}
            />
            <div className="search-menu-icon" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </div>
          </div>

          <div className={`search-page-links ${isMenuOpen ? "open" : ""}`}>
            <FontAwesomeIcon icon={faShoppingCart} className="navbar-icon" onClick={(e)=>{e.preventDefault();navigate('/cart')}}/>
            <FontAwesomeIcon
              icon={faUser}
              className="navbar-icon"
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile");
              }}
            />
            {user && (
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="navbar-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleUserLogout();
                }}
              />
            )}
            {!user && (
              <FontAwesomeIcon
                icon={faSignInAlt}
                className="navbar-icon"
                onClick={(e)=>{
                  e.preventDefault();
                  navigate('/login')
                }}
              />
            )}
          </div>
        </div>
        <hr />
        <Loader />
        <div className="search-footer">Footer</div>
      </div>
    );
  }
  return (
    <div className="search-container">
      <div className="search-input">
        <div className={`search-page-links ${isMenuOpen ? "open" : ""}`}>
          <a href="/" className="search-link">
            Home
          </a>
          <a href="#about" className="search-link">
            About
          </a>
        </div>
        <div className={`search-page-search ${isMenuOpen ? "open" : ""}`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="search-icon"
            style={{
              transform: "translateX(-40px)",
              transition: "transform 0.3s ease",
              margin: "auto",
              fontSize: "25px",
              cursor: "pointer",
            }}
          />
          <div className="search-menu-icon" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </div>
        </div>

        <div className={`search-page-links ${isMenuOpen ? "open" : ""}`}>
          <FontAwesomeIcon icon={faShoppingCart} className="navbar-icon" onClick={(e)=>{e.preventDefault();navigate('/cart')}}/>
          <FontAwesomeIcon
            icon={faUser}
            className="navbar-icon"
            onClick={(e) => {
              e.preventDefault();
              navigate("/profile");
            }}
          />
          {user && (
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="navbar-icon"
              onClick={(e) => {
                e.preventDefault();
                handleUserLogout();
              }}
            />
          )}
          {!user && (
            <FontAwesomeIcon
              icon={faSignInAlt}
              className="navbar-icon"
              onClick={(e)=>{
                e.preventDefault();
                navigate('/login')
              }}
            />
          )}
        </div>
      </div>
      <hr />
      <div className="search-heading">Top search</div>
      <div className="search-results">
        {showProducts.map((val, index) => (
          <div key={index} className="search-item-grid">
            <div className="image-container" onClick={()=>{loadProductPage(index)}}>
              <div
                className="image-crop"
                style={{
                  backgroundImage: `url(${val.images[2]})`,
                }}
              ></div>
            </div>
            <div className="search-product-name">
              <p>{val.name}</p>
            </div>
            <div className="search-product-name">
              <p>Rs {val.price}/- onwards </p>
            </div>
            <div className="search-product-icons">
              <img src={recycle} alt="" />
              <img src={bag} alt="" />
              <img src={fast_delivery_icon} alt="" />
            </div>
          </div>
        ))}
      </div>
      <section className="client-reviews">
        <div className="reviews">
          <h3>Hear from our Customers</h3>

          <p>
            1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
            sint hic minima rem repudiandae, placeat similique, vero illo non
            corrupti nulla. Minima nobis aut impedit pariatur asperiores
            deserunt itaque cum.
          </p>
          <h2>-Virat Kohli</h2>
          <p className="designation">-King of Cricket</p>
          <p>
            1. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
            sint hic minima rem repudiandae, placeat similique, vero illo non
            corrupti nulla. Minima nobis aut impedit pariatur asperiores
            deserunt itaque cum.
          </p>
          <h2>Rohit Sharma</h2>
          <p className="designation">-Captain of ICT</p>
        </div>
      </section>
    </div>
  );
};

export default Search;
