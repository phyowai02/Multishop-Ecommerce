import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import ProductDetail from "./ProductDetail";
import { FaCartShopping } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const token = localStorage.getItem("x-access-token");
  const [searchItem, setSearchItem] = useState("");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  // Sorting state
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const shopId = query.get("shopId");

    if (shopId) {
      getProductsByAdminId(shopId);
    } else {
      getProducts();
    }
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://192.168.1.11:8090/api/product", {
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

  const getProductsByAdminId = async (adminId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.11:8090/api/product/admin/${adminId}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setProductList(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Filter products by search input
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "name-asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOption === "name-desc") {
      return b.name.localeCompare(a.name);
    } else if (sortOption === "price-asc") {
      return a.price - b.price;
    } else if (sortOption === "price-desc") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

  // Get current products based on pagination
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPage = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-full">
      <div className="bg-slate-200">
        <Sidebar />
      </div>
      <div className="flex">
        <div className="w-full md:w-[75%] m-auto h-full mt-5">
          <div className="md:py-5 px-4 md:px-10 flex justify-between">
            <div>
              {/* Sorting Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 rounded-md bg-slate-100 outline-slate-400"
              >
                <option value="">Sort By</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            <div>
              {/* Search Box */}
              <input
                type="text"
                placeholder="Search Products..."
                className="p-2 rounded-md bg-slate-100 outline-slate-400 hidden md:flex"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
          </div>

          {/* Grid to display products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 m-5 mt-5">
            {loading ? (
              <Spinner />
            ) : currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="border-2 border-slate-300 cursor-pointer"
                  onClick={() => {
                    navigate("/productdetail", {
                      state: { selectedProduct: product },
                    });
                  }}
                >
                  {/* Product Image */}
                  <div className="my-2 mx-16 md:m-10">
                    <img
                      src={product.imgURLs?.[0] || "placeholder-image-url"}
                      alt={product.name}
                      className="w-44 h-44 md:h-32 md:w-32 object-cover ms-7"
                    />
                  </div>

                  <div className="p-5 bg-slate-100">
                    <div className="flex mb-1">
                      <h1 className="w-1/3 font-semibold mb-2">Name</h1>
                      <p className="w-2/3 text-end font-semibold">
                        {product.name}
                      </p>
                    </div>
                    <div className="flex mb-1">
                      <h1 className="w-1/3 font-semibold mb-2">Stocks</h1>
                      <p className="w-2/3 text-end">{product.count}</p>
                    </div>
                    <div className="flex mb-1">
                      <h1 className="w-1/3 font-semibold mb-2">Price</h1>
                      <p className="w-2/3 text-end">{product.price} mmk</p>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <div>
                        <FaCartShopping className="cursor-pointer text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No Product available</p>
            )}
          </div>

          {/* Pagination controls */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-end m-5 mt-10">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-300 rounded-md cursor-pointer"
              >
                <IoIosArrowBack />
              </button>
              {Array.from({ length: totalPage }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  } rounded-md cursor-pointer`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage >=
                  Math.ceil(filteredProducts.length / productsPerPage)
                }
                className="px-4 py-2 mx-1 bg-gray-300 rounded-md cursor-pointer"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
