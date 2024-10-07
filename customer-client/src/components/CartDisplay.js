import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { RiArrowGoBackFill } from "react-icons/ri";
import { AiTwotoneDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartDisplay = () => {
  const token = localStorage.getItem("x-access-token");
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } =
    useContext(CartContext);
  const [inputAddress, setInputAddress] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Calculate the total price
  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Handle order submission
  const handleOrder = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");

    if (!inputAddress) {
      alert("Please enter your address.");
      return;
    }

    // Group items by adminId
    const groupedItems = cartItems.reduce((groups, item) => {
      if (!groups[item.adminId]) {
        groups[item.adminId] = [];
      }
      groups[item.adminId].push(item);
      return groups;
    }, {});

    try {
      for (const adminId in groupedItems) {
        const orderData = {
          userId,
          username,
          address: inputAddress,
          phone: inputPhone,
          items: groupedItems[adminId],
          total: groupedItems[adminId].reduce(
            (total, item) => total + item.price * item.quantity,
            0
          ),
          status: "pending",
        };

        const response = await axios.post(
          "https://multishop-ecommerce-wbac.onrender.com/api/order/create",
          orderData,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (response.status === 201) {
          clearCart();
          setInputAddress("");
          setInputPhone("");
        }
      }
      navigate("/success");
    } catch (error) {
      console.error("Failed to place order", error);
      alert("Failed to place order, please try again.");
    }
  };

  // handle quantity increase
  const handleIncreaseQuantity = (itemId) => {
    const item = cartItems.find((cartItem) => cartItem.uniqueId === itemId);
    updateCartItemQuantity(itemId, 1, item.stock);
  };

  // handle quantityDecrease
  const handleDecreaseQuantity = (itemId) => {
    const item = cartItems.find((cartItem) => cartItem.uniqueId === itemId);
    updateCartItemQuantity(itemId, -1, item.stock);
  };

  const ColorDisplay = ({ colorHex }) => {
    const colorBoxStyle = {
      backgroundColor: colorHex,
      width: "25px",
      height: "25px",
      display: "inline-block",
      borderRadius: "50%",
      marginLeft: "5px",
      cursor: "pointer",
    };

    return <div className="color-box" style={colorBoxStyle}></div>;
  };

  return (
    <div className="md:w-full w-[160vw]">
      <div className="product-bg">
        <div className="flex justify-between p-2 text-slate-600 text-xl mx-3">
          <div
            className="flex items-center cursor-pointer rounded-lg nav p-2"
            onClick={() => navigate("/product")}
          >
            <RiArrowGoBackFill />
            <span className="mx-1">Back</span>
          </div>
          <div>
            <h1 className="cursor-pointer rounded-lg p-2 nav" onClick={logout}>
              Logout
            </h1>
          </div>
        </div>
      </div>
      <div className="w-[100%] md:w-[70%] mt-5 m-auto h-full bg-slate-100 rounded-tl-2xl rounded-tr-2xl">
        <div className="grid grid-cols-6 text-center text-xl p-3 text-white bg-slate-400 rounded-tl-2xl rounded-tr-2xl">
          <h1>No</h1>
          <h2>Product Name</h2>
          <h3>Size</h3>
          <h3>Color</h3>
          <h4>Quantity</h4>
          <h5 className="me-7">Price</h5>
        </div>
        <div className="pt-3 h-[125vh] md:h-[62vh] md:w-full overflow-x-auto overflow-y-auto cursor-pointer">
          {cartItems.length > 0 ? (
            <div>
              {cartItems.map((item, index) => (
                <div
                  key={item.uniqueId}
                  className="grid grid-cols-6 p-4 items-center text-center bg-slate-300 rounded-lg mt-3 cart-item"
                >
                  <p>{index + 1}</p>
                  <div className="flex items-center">
                    <img
                      src={item.imgURL[0]}
                      className="w-10 h-9 mr-2"
                      alt={item.productName}
                    />
                    <p>{item.productName}</p>
                  </div>
                  <p>{item.selectedSize}</p>
                  <div>
                    <ColorDisplay colorHex={item.selectedColor} />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      className="text-black rounded-full text-2xl"
                      onClick={() => handleDecreaseQuantity(item.uniqueId)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <p className="mx-5">{item.quantity}</p>
                    <button
                      className="text-black rounded-full text-2xl"
                      onClick={() => handleIncreaseQuantity(item.uniqueId)}
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center">
                    <div className="w-60 text-center">
                      <p>{item.price} MMK</p>
                    </div>
                    <div>
                      <AiTwotoneDelete
                        className="cursor-pointer text-red-700 delete-button"
                        onClick={() => removeFromCart(item.uniqueId)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
        <div className="flex justify-between bg-slate-500 mt-3 p-3 text-white">
          <div className="ms-24">Total Amount</div>
          <div className="text-end me-20">
            {totalAmount.toLocaleString()} MMK
          </div>
        </div>
      </div>
      <div className="product-bg md:h-[10.3vh] p-3">
        <div className="flex justify-end w-[100%] md:w-[98%] p-1">
          <input
            type="text"
            placeholder="Enter Address"
            className="p-2 rounded-md w-full md:w-[25%] me-5 outline-none"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Phone"
            className="p-2 rounded-md w-full md:w-[25%] me-5 outline-none"
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
          />
          <button
            className="py-2 px-10 text-lg rounded-md buy-button"
            onClick={handleOrder}
          >
            Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDisplay;
