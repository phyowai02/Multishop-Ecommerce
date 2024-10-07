import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "./Spinner";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const location = useLocation();
  const { selectedProduct } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [productCounts, setProductCounts] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [cartCounts, setCartCounts] = useState({});
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (selectedProduct) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [selectedProduct]);

  // Default selected for size
  useEffect(() => {
    if (
      selectedProduct &&
      selectedProduct.weight &&
      selectedProduct.weight.length > 0
    ) {
      setSelectedSize(selectedProduct.weight[0]);
    }
  }, [selectedProduct]);

  // Slider settings for carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Handle increment for each product
  const incrementCount = (productId, productStock) => {
    const currentCount = productCounts[productId] || 1;
    const cartCount = cartCounts[productId] || 0; // Get current cart count for the product
    const availableStock = productStock - cartCount;

    if (currentCount < availableStock) {
      setProductCounts((prevCounts) => ({
        ...prevCounts,
        [productId]: currentCount + 1,
      }));
    } else {
      alert("Cannot add more items than available in stock");
    }
  };

  // Handle decrement for each product
  const decrementCount = (productId) => {
    const currentCount = productCounts[productId] || 1;
    if (currentCount > 1) {
      setProductCounts((prevCounts) => ({
        ...prevCounts,
        [productId]: currentCount - 1,
      }));
    }
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Add product to cart
  const handleAddToCart = (product) => {
    if (!selectedSize || !selectedColor) {
      alert("Please select color before adding to cart");
      return;
    }

    const count = productCounts[product._id] || 1;
    const cartCount = cartCounts[product._id] || 0;
    const totalAfterAdd = cartCount + count;

    if (totalAfterAdd > product.count) {
      alert("Cannot add more items than available in stock");
      return;
    }

    const productWithSelections = { ...product, selectedSize, selectedColor };
    addToCart(productWithSelections, count);

    // Update cart count for the product
    setCartCounts((prevCartCounts) => ({
      ...prevCartCounts,
      [product._id]: totalAfterAdd,
    }));

    Toastify({
      text: "Successfully added",
      backgroundColor: "#A3E635",
      className: "info",
      position: "center",
    }).showToast();

    // Reset selections and count
    setSelectedColor(null);
    setProductCounts((prevCounts) => ({
      ...prevCounts,
      [product._id]: 1,
    }));
  };

  const filteredImageURLs = selectedProduct?.imgURLs
    ? [...new Set(selectedProduct.imgURLs)]
    : [];

  const ColorDisplay = ({ colorHex, onClick }) => {
    const colorBoxStyle = {
      backgroundColor: colorHex,
      width: "25px",
      height: "25px",
      display: "inline-block",
      borderRadius: "50%",
      marginLeft: "5px",
      cursor: "pointer",
      border:
        selectedColor === colorHex ? "3px solid limegreen" : "1px solid gray",
    };

    return (
      <div
        className="color-box"
        style={colorBoxStyle}
        onClick={() => onClick(colorHex)}
      />
    );
  };

  return (
    <div className="mt-3 text-slate-600">
      <h1 className="flex justify-center text-2xl font-mono">
        Product Details
      </h1>
      {selectedProduct ? (
        <div>
          {loading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex justify-center mt-2">
                {filteredImageURLs.length > 0 ? (
                  filteredImageURLs.length > 1 ? (
                    <Slider {...settings} className="w-[45%] md:w-[10%]">
                      {filteredImageURLs.map((url, index) => (
                        <div key={index}>
                          <img
                            src={url}
                            alt={`Product ${index}`}
                            className="object-cover md:w-40"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <img
                      src={filteredImageURLs[0]}
                      alt="Product"
                      className="object-cover"
                    />
                  )
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <div className="md:w-[45%] m-auto">
                <div className="flex pt-10 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Name</h2>
                  <h2 className="w-2/3 text-end">{selectedProduct.name}</h2>
                </div>
                <div className="flex py-2 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Content</h2>
                  <p className="w-2/3 text-end">{selectedProduct.content}</p>
                </div>
                <div className="flex py-2 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Stock</h2>
                  <p className="w-2/3 text-end">{selectedProduct.count}</p>
                </div>
                <div className="flex py-2 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Size</h2>
                  <div className="w-2/3 text-end flex justify-end space-x-2">
                    {selectedProduct.weight.map((size) => (
                      <div
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`p-1 cursor-pointer border rounded-lg ${
                          selectedSize === size
                            ? "border-lime-600 border-2"
                            : "border-gray-300"
                        }`}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex py-2 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Price</h2>
                  <p className="w-2/3 text-end">{selectedProduct.price} mmk</p>
                </div>
                <div className="flex py-2 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Colors</h2>
                  <div className="w-2/3 text-end flex justify-end">
                    {selectedProduct.color &&
                    selectedProduct.color.length > 0 ? (
                      selectedProduct.color.map((color, index) => (
                        <ColorDisplay
                          key={index}
                          colorHex={color}
                          onClick={handleColorSelect}
                        />
                      ))
                    ) : (
                      <p>No colors available</p>
                    )}
                  </div>
                </div>
                <div className="flex pt-10 px-14 font-mono">
                  <h2 className="w-1/3 font-semibold text-xl">Quantity</h2>
                  <div className="w-2/3 text-end flex items-center justify-end space-x-4">
                    <button
                      onClick={() => decrementCount(selectedProduct._id)}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      -
                    </button>
                    <span>{productCounts[selectedProduct._id] || 1}</span>
                    <button
                      onClick={() =>
                        incrementCount(
                          selectedProduct._id,
                          selectedProduct.count
                        )
                      }
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-center py-3 mt-3">
                  <button
                    onClick={() => navigate("/product")}
                    className="bg-red-600 text-white px-5 py-2 rounded me-20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="bg-lime-600 text-white px-5 py-2 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <h2 className="flex justify-center mt-3">Product not found!</h2>
      )}
    </div>
  );
};

export default ProductDetail;
