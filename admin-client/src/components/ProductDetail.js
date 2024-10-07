import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Spinner from "./Spinner";
import axios from "axios";
import { getStorage, ref, deleteObject } from "firebase/storage";

const ProductDetail = ({
  selectedProduct,
  getProducts,
  clearSelectedProduct,
  openModalForUpdate,
  token,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProduct) {
      setTimeout(() => setLoading(false), 1000);
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

  const deleteImagesFromFirebase = async (imgURLs) => {
    if (!imgURLs || imgURLs.length === 0) return;

    const storage = getStorage();

    for (const url of imgURLs) {
      const imageRef = ref(storage, url);

      try {
        await deleteObject(imageRef);
        // console.log(`Image ${url} deleted successfully from firebase`);
      } catch (error) {
        console.error("Error deleting from firebase", error);
      }
    }
  };

  const handleDelete = async (id) => {
    console.log("id", id);
    if (window.confirm("Are you sure you want to delete this unit?")) {
      setLoading(true);
      try {
        // Delete images from firebase
        await deleteImagesFromFirebase(selectedProduct.imgURLs);

        // Delete the product from Mongo
        await axios.delete(
          `https://multishop-ecommerce-wbac.onrender.com/api/product/${id}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        console.log("Deleted successfully!");
        getProducts();
        clearSelectedProduct();
      } catch (error) {
        console.log("Delete error: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredImageURLs = selectedProduct?.imgURLs
    ? [...new Set(selectedProduct.imgURLs)] // Filter out duplicate images
    : [];

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

    return (
      <div className="color-box" style={colorBoxStyle}>
        <div className="hex-tooltip">{colorHex}</div>
      </div>
    );
  };

  return (
    <div className="mt-16 text-white">
      <h1 className="flex justify-end me-10 text-2xl font-mono">
        Product Details
      </h1>
      {selectedProduct ? (
        <div className="w-[448px]">
          {loading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="flex justify-center ms-24 mt-5 h-[24vh]">
                {filteredImageURLs.length > 0 ? (
                  filteredImageURLs.length > 1 ? (
                    <Slider {...settings} className="w-[45%]">
                      {filteredImageURLs.map((url, index) => (
                        <div key={index}>
                          <img
                            src={url}
                            alt={`Product ${index}`}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <img
                      src={filteredImageURLs[0]}
                      alt="Product"
                      className="w-28 h-28 object-cover rounded-md shadow-md"
                    />
                  )
                ) : (
                  <p>No images available</p>
                )}
              </div>
              <div className="flex pt-10 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Name</h2>
                <h2 className="w-2/3 text-end">{selectedProduct.name}</h2>
              </div>
              <div className="flex py-3 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Content</h2>
                <p className="w-2/3 text-end">{selectedProduct.content}</p>
              </div>
              <div className="flex py-3 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Stock</h2>
                <p className="w-2/3 text-end">{selectedProduct.count}</p>
              </div>
              <div className="flex py-3 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Size</h2>
                {/* <p className='w-2/3 text-end'>{selectedProduct.weight}{unitShort}</p> */}
                <p className="w-2/3 text-end">
                  {selectedProduct.weight.join(",")}
                </p>
              </div>
              <div className="flex py-3 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Price</h2>
                <p className="w-2/3 text-end">{selectedProduct.price}mmk</p>
              </div>
              <div className="flex py-3 px-20 font-mono">
                <h2 className="w-1/3 font-semibold text-xl">Colors</h2>
                <div className="w-2/3 text-end flex justify-end">
                  {selectedProduct.color && selectedProduct.color.length > 0 ? (
                    selectedProduct.color.map((color, index) => (
                      <ColorDisplay key={index} colorHex={color} />
                    ))
                  ) : (
                    <p>No colors available</p>
                  )}
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <button
                  className="p-2 mx-5 bg-green-500 rounded-lg cursor-pointer"
                  onClick={() => openModalForUpdate(selectedProduct)}
                >
                  Update
                </button>
                <button
                  className="p-2 mx-5 bg-red-500 rounded-lg cursor-pointer"
                  onClick={() => handleDelete(selectedProduct._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="flex justify-center items-center h-[70vh] font-mono text-2xl">
          No product selected
        </p>
      )}
    </div>
  );
};

export default ProductDetail;
