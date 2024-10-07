import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Model from "./ProductModel";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
import Spinner from "./Spinner";
import ProductDetail from "./ProductDetail";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { AiTwotoneMinusCircle } from "react-icons/ai";

const Product = ({token}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [update, setUpdate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [unit, setUnit] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputContent, setInputContent] = useState("");
  const [inputCount, setInputCount] = useState("");
  const [inputPrice, setInputPrice] = useState("");
  const [inputWeight, setInputWeight] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [productlist, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const adminId = localStorage.getItem("userId");

  // Adding colors and size
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);

  useEffect(() => {
    getUnits();
    getProducts();
  }, []);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => URL.revokeObjectURL(image));
    };
  }, [previewImages]);

  const showToast = (message, type) => {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "#A3E635" : "#FF5800",
      stopOnFocus: true, // Prevents dismissing on hover
    }).showToast();
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8090/api/product/admin/${adminId}`, {
        headers: {
          "x-access-token": token,
        },
      });
      setProductList(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUnits = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/unit/", {
        headers: {
          "x-access-token": token,
        },
      });
      setUnit(response.data.units || response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openModalForUpdate = (product) => {
    setUpdate(true); // Enable update mode
    setInputName(product.name);
    setInputContent(product.content);
    setInputPrice(product.price);
    // setInputWeight(product.weight);
    setInputCount(product.count);
    setSelectedUnitId(product.unit);
    setPreviewImages(product.imgURLs || []);
    setSelectedFiles([]); // Clear selected files for new ones
    setIsOpen(true); // Open modal
    setSelectedProduct(product); // Set the selected product
  };

  const openModal = (type) => {
    setModalType(type);
    setIsOpen(true);
    setSelectedProduct(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUpdate(false);
    setInputName("");
    setInputContent("");
    setInputCount("");
    setInputPrice("");
    setSelectedFiles([]);
    setPreviewImages([]);
    setSelectedUnitId(null);
    setInputWeight("");
  };

  const checkImageExistsInFirebase = async (fileName) => {
    try {
      const imageRef = ref(storage, `products/${fileName}`);
      const imgURL = await getDownloadURL(imageRef);
      return imgURL;
    } catch (error) {
      // If an error occurs, it means the image does not exist
      return null;
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const existingImgURLs = selectedProduct ? selectedProduct.imgURLs : [];
    const existingFileNames = existingImgURLs.map((url) => {
      const match = url.match(/%2F([^?]+)\?/);
      return match ? decodeURIComponent(match[1]) : null;
    });

    const filesToUpload = [];
    const duplicates = [];

    for (const file of files) {
      if (existingFileNames.includes(file.name)) {
        duplicates.push(file);
      } else {
        const firebaseURL = await checkImageExistsInFirebase(file.name);
        if (firebaseURL) {
          duplicates.push(file);
        } else {
          filesToUpload.push(file);
        }
      }
    }

    if (duplicates.length > 0) {
      showToast("Some selected images are already uploaded!", "error");
    }

    if (filesToUpload.length > 0) {
      const newPreviewImages = filesToUpload.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages([...previewImages, ...newPreviewImages]);
      setSelectedFiles([...selectedFiles, ...filesToUpload]);
    }
  };

  const uploadImagesToFirebase = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const imageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(imageRef, file);
      const imgURL = await getDownloadURL(imageRef);
      return imgURL;
    });
    return await Promise.all(uploadPromises);
  };

  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedImgURLs = [];
      const existingImgURLs = selectedProduct ? selectedProduct.imgURLs : [];

      // Filter out any selected files that have the same name as an existing image
      const filteredFiles = selectedFiles.filter((file) => {
        return !existingImgURLs.some((url) => url.includes(file.name));
      });

      if (filteredFiles.length > 0) {
        uploadedImgURLs = await uploadImagesToFirebase(filteredFiles);
      }

      const finalImgURLs = [...existingImgURLs, ...uploadedImgURLs];
      const adminId = localStorage.getItem("userId");

      const productData = {
        name: inputName,
        content: inputContent,
        imgURLs: finalImgURLs,
        unit: selectedUnitId,
        count: inputCount,
        price: inputPrice,
        weight: sizes,
        color: colors,
        adminId
      };

      if (update) {
        // Update existing product logic
        await axios.put(
          `http://localhost:8090/api/product/${selectedProduct._id}`,
          productData,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
        showToast("Product updated successfully!", "success");
        clearSelectedProduct();
      } else {
        await axios.post("http://localhost:8090/api/product", productData, {
          headers: {
            "x-access-token": token,
          },
        });
        showToast("Product added successfully!", "success");
      }
      getProducts();
      closeModal();
    } catch (error) {
      console.log(error);
      showToast("Error occurred while adding/updating product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = (e) => {
    e.preventDefault();
    if (inputWeight.trim() !== "" && !sizes.includes(inputWeight)) {
      setSizes([...sizes, inputWeight]);
      setInputWeight(""); // Clear the input after adding
    }
  };

  const handleAddColor = (e) => {
    e.preventDefault();
    if (inputColor.trim() !== "" && !colors.includes(inputColor)) {
      setColors([...colors, inputColor]);
      setInputColor(""); // Clear the input after adding
    }
  };

  // Get current products for paginaiton
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Filter products
  const filteredProducts = productlist.filter((product) =>
    product.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="sideB w-full h-full flex">
        <Model
          isOpen={isOpen}
          closeModal={closeModal}
          title={modalType === "update" ? "Update Product" : "Add Product"}
        >
          <form onSubmit={addOrUpdateProduct} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Product Name"
                className="bg-gray-100 border-2 border-gray-300 rounded-lg px-3 outline-none w-full focus:ring-2 focus:ring-slate-100"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
              <input
                type="number"
                className="bg-gray-100 border-2 border-gray-300 rounded-md p-2 outline-none w-full focus:ring-2 focus:ring-slate-100"
                placeholder="Price"
                value={inputPrice}
                onChange={(e) => setInputPrice(e.target.value)}
              />
            </div>

            <div>
              <textarea
                placeholder="Enter Content..."
                className="bg-gray-100 border-2 border-gray-300 rounded-lg pt-2 px-3 outline-none w-full focus:ring-2 focus:ring-slate-100"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter size"
                  className="bg-gray-100 border-2 border-gray-300 rounded-md p-2 outline-none w-2/3 focus:ring-2 focus:ring-slate-100"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                />
                <button
                  className="ms-3 w-1/3 bg-lime-400 rounded-lg "
                  onClick={handleAddSize}
                >
                  Add
                </button>
              </div>
              <div className="flex">
                <div className="flex items-center w-2/3">
                  <input
                    type="color"
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value)}
                  />
                  <p className="">{inputColor}</p>
                </div>
                <button
                  className="ms-1 w-1/3 bg-lime-400 rounded-lg"
                  onClick={handleAddColor}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <div className=" bg-slate-200 h-[6.4vh] overflow-y-auto ps-2 py-2">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="mr-1">{size}</span>
                      <AiTwotoneMinusCircle
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemoveSize(size)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="bg-slate-200 h-[6.4vh] overflow-y-auto ps-2 py-2">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center mt-1">
                      <span className="mr-2">{color}</span>
                      <AiTwotoneMinusCircle
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemoveColor(color)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="relative bg-gray-100 border-2 border-gray-300 rounded-lg p-2 outline-none w-full focus:ring-2 focus:ring-slate-100">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  multiple
                />
                <span className="text-gray-500">Choose images to upload</span>
              </div>
            </div>

            <div className="flex w-[100%]">
              {previewImages.map((image, index) => (
                <div key={index} className="p-1">
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {loading && <Spinner />}
              <div>
                <select
                  className="bg-gray-100 border-2 border-gray-300 rounded-md p-2 outline-none w-full focus:ring-2 focus:ring-slate-100"
                  value={selectedUnitId || ""}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                >
                  <option>Select Unit</option>
                  {unit.length > 0 ? (
                    unit.map((Unit) => (
                      <option key={Unit._id} value={Unit._id}>
                        {Unit.name}
                      </option>
                    ))
                  ) : (
                    <option>No Unit</option>
                  )}
                </select>
              </div>
              <input
                type="number"
                className="bg-gray-100 border-2 border-gray-300 rounded-md p-2 outline-none w-full focus:ring-2 focus:ring-slate-100"
                placeholder="Count"
                value={inputCount}
                onChange={(e) => setInputCount(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-lime-500 p-3 text-white rounded-md w-full hover:bg-lime-600 transition"
            >
              {update ? "Update Product" : "Add Product"}
            </button>
          </form>
        </Model>

        <div className="w-[65%]">
          <div className="h-[83vh]">
            <div className="flex justify-between m-8">
              <button
                onClick={() => openModal("add")}
                className="bg-lime-700 p-2 text-white shadow-lg rounded-md font-semibold"
              >
                Add New Product
              </button>
              {/* Search Box */}
              <input
                type="text"
                placeholder="Search Products..."
                className="p-2 rounded-md outline-lime-600"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
            <div>
              {loading ? (
                <Spinner />
              ) : (
                <table className="h-[50%] w-[98%] m-auto bg-white">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="py-3 px-1 border">No</th>
                      <th className="py-3 px-1 border">Name</th>
                      <th className="py-3 px-4 border">Stock</th>
                      <th className="py-3 px-4 border">Weight/Size</th>
                      <th className="py-3 px-4 border">Price</th>
                    </tr>
                  </thead>
                  <tbody className="cursor-pointer">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((item, index) => {
                        const unitObj = unit.find((u) => u._id === item.unit);
                        const unitShort = unitObj
                          ? unitObj.short
                          : "Unknown Unit";

                        // Highlight the selected product
                        const isSelected =
                          selectedProduct && selectedProduct._id === item._id;

                        return (
                          <tr
                            key={item._id}
                            className={`text-center font-mono ${
                              isSelected ? "bg-slate-400" : ""
                            } `}
                            onClick={() => handleProductClick(item)}
                          >
                            <td className="py-3 px-3 border">
                              {indexOfFirstProduct + index + 1}
                            </td>
                            <td className="py-3 px-3 border">{item.name}</td>
                            <td className="py-3 px-3 border">{item.count}</td>
                            <td className="py-3 px-3 border">
                              {item.weight.join(",")}
                            </td>
                            {/* <td className="py-3 px-3 border">{item.weight}{unitShort}</td> */}
                            <td className="py-3 px-3 border">{item.price}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="12"
                          className="py-2 px-5 border text-center"
                        >
                          No products available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Paginatin controls */}
          <div className="flex justify-end me-10">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 rounded-md cursor-pointer"
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-1">{currentPage}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              // disabled={indexOfLastProduct >= productlist.length}
              disabled={
                currentPage >= Math.ceil(productlist.length / productsPerPage)
              }
              className="px-4 py-2 mx-1 bg-gray-300 rounded-md cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>

        <div className="bg-slate-400 w-[35%] min-w-[300px] rounded-tl-full">
          <ProductDetail
            selectedProduct={selectedProduct}
            getProducts={getProducts}
            clearSelectedProduct={clearSelectedProduct}
            openModalForUpdate={openModalForUpdate}
            token={token}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
