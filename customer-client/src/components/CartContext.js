import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, count) => {
      console.log("product:",product);
      const uniqueId = `${product._id}_${product.selectedSize}_${product.selectedColor}`;
      
        setCartItems((prevItems) => {
          const existingItemIndex = prevItems.findIndex((item) => item.uniqueId === uniqueId);
      
          let updatedItems;
          if (existingItemIndex >= 0) {

            updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += Number(count);
          } else {
            // updatedItems = [...prevItems, { ...product, uniqueId, quantity: Number(count) || 1 }];
            const selectedProduct = {
              _id: product._id,
              uniqueId,
              productName: product.name,
              selectedSize: product.selectedSize,
              selectedColor: product.selectedColor,
              quantity: Number(count) || 1,
              price: product.price,
              imgURL: product.imgURLs,
              stocks: product.count,
              adminId: product.adminId,
            };
            updatedItems = [...prevItems, selectedProduct];
          }

          console.log("Updated cart items:", updatedItems); 
          return updatedItems;
        });
      };      

    // Calculate total items count
    const totalItemCount = cartItems.reduce((total, item) => {
        return total + (item.quantity || 0);
    }, 0);

    // console.log("Total item count:", totalItemCount);   

    // Function to remove
    const removeFromCart = (uniqueId) => {
      setCartItems((prevItems) => prevItems.filter(item => item.uniqueId !== uniqueId));
    };

    // Function to clear
    const clearCart = () => {
      setCartItems([]);
    }

    const updateCartItemQuantity = (itemId, amount, stock) => {
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if(item.uniqueId === itemId) {
            const newQuantity = item.quantity + amount;
            if(amount > 0 && newQuantity > stock) {
              alert("Cannot exceed available stock");
              return item;
            } else if(amount < 0 && newQuantity < 1) {
              return item;
            }
            return  { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    };
    
    // Provide the cart and addToCart function
    return (
        <CartContext.Provider value={{cartItems, addToCart, totalItemCount, removeFromCart, clearCart, updateCartItemQuantity}}>
          {children}
        </CartContext.Provider>
    );
};