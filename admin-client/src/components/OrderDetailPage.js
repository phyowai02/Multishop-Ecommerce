import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { RiArrowGoBackFill } from "react-icons/ri";
import { LuUserCircle } from "react-icons/lu";
import { RiDeleteBin7Fill } from "react-icons/ri";
import Spinner from './Spinner';
import Sidebar from './Sidebar';

const OrderDetailPage = ({ token }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [statusList, setStatusList] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("pending");
    const [deletedItems, setDeletedItems] = useState([]);
    const [admins, setAdmins] = useState([]);

    const role = localStorage.getItem("role");
    const adminId = localStorage.getItem("userId");

    useEffect(() => {
        fetchOrder();
        getStatus();
        fetchAdmin();
    }, [id, token]);

    const fetchAdmin = async () => {
        setLoading(true);
        try {
            const response = await axios(`http://localhost:8090/api/adminuser/`, {
                headers: {
                    "x-access-token": token,
                }
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Failed to fetch admin: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`http://localhost:8090/api/order/${id}`, {
                headers: {
                    "x-access-token": token,
                }
            });
            // console.log("Order:", response.data);
            if(role === 'shop admin') {
                const filteredItems = response.data.items.filter(item => item.adminId === adminId);
                setOrder({ ...response.data, items: filteredItems });
            }
            else {
                setOrder(response.data);
            }
            setSelectedStatus(response.data.status || "pending");
        } catch (error) {
            console.error("Failed to fetch order details:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatus = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8090/api/status`, {
                headers: {
                    "x-access-token": token
                }
            });
            setStatusList(response.data.allStatus || response.data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);
        await updateOrderStatus(newStatus);
    };

    const handleQuantityChange = (uniqueId, value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue) || numericValue < 0) {
            return;
        }
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [uniqueId]: numericValue
        }));
    };

    const updateOrderStatus = async (status) => {
        const itemsToUpdate = order.items.map(item => {
            const updatedQuantity = quantities[item.uniqueId] !== undefined ? quantities[item.uniqueId] : item.quantity;
            return {
                _id: item._id,
                productName: item.productName,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                imgURL: item.imgURL,
                quantity: updatedQuantity,
            };
        });

        try {
            console.log("updating order with:", { items: itemsToUpdate, status: status });

            const response = await axios.put(`http://localhost:8090/api/order/${id}/status`, {
                items: itemsToUpdate,
                status: status,
            }, {
                headers: {
                    "x-access-token": token,
                }
            });

            alert(`Order status updated to ${response.data.order.status} successfully!`);
            fetchOrder();
            navigate('/orderdetail');
        } catch (error) {
            console.error(`Failed to update the order status:`, error.response ? error.response.data : error.message);
            alert(`Error updating the order status`);
        }
    };

    const handleDeleteItem = (uniqueId) => {
        const itemToDelete = order.items.find(item => item.uniqueId === uniqueId);
        if (itemToDelete) {
            setDeletedItems(prevDeletedItems => [...prevDeletedItems, itemToDelete]);
        }
        setOrder(prevOrder => ({
            ...prevOrder,
            items: prevOrder.items.filter(item => item.uniqueId !== uniqueId)
        }));
    };

    if (loading) {
        return <Spinner />;
    }

    if (!order) {
        return <div>No order found.</div>;
    }

    const ColorDisplay = ({ colorHex }) => {
        const colorBoxStyle = {
            backgroundColor: colorHex,
            width: "25px",
            height: "25px",
            display: "inline-block",
            borderRadius: "50%",
            marginLeft: '5px',
            cursor: 'pointer',
        };

        return <div style={colorBoxStyle}></div>;
    };

    const isEditable = role !== "super admin" && selectedStatus !== "declined";

    return (
        <div className='h-screen flex'>
            <Sidebar />
            <div className='sideB w-full h-full'>
                <div className='flex justify-between p-2 text-slate-600 text-lg mx-3'>
                    <div>
                        <h1 className='cursor-pointer rounded-lg p-2'>Orders / Order Details</h1>
                    </div>
                    <div className='flex'>
                        <div className='mx-6 flex items-center'>
                            <LuUserCircle className='text-3xl text-lime-800' />
                            <h1 className='ms-1 text-xl text-slate-600'>{order.username}</h1>
                        </div>
                        <div className='flex items-center cursor-pointer rounded-lg text-white p-2 bg-lime-600' onClick={() => navigate('/orderdetail')}>
                            <RiArrowGoBackFill />
                            <span className='mx-1'>Back</span>
                        </div>
                    </div>
                </div>
                <div className='mx-9 my-6 flex justify-between'>
                    <h1 className='font-semibold text-slate-600'>Order Details ({order.items ? order.items.length : 0})</h1>
                    <div className='flex items-center'>
                        <h1>Status:</h1>
                        <select
                            className='border p-2 rounded-lg mx-3'
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            disabled={!isEditable}
                        >
                            <option value="">Select Status</option>
                            {statusList.map((status) => (
                                <option key={status._id} value={status.status}>
                                    {status.status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='mx-7'>
                    <div className='bg-slate-400 p-2 rounded-lg'>
                        <div className='flex px-3 text-white font-semibold'>
                            <div className='w-[38%] grid grid-cols-2'>
                                <h1>Product Name</h1>
                                <h1>Shop Logo</h1>
                            </div>
                            <div className='grid grid-cols-3 gap-5 w-[38%]'>
                                <h2>Color</h2>
                                <h3>Size</h3>
                                <h4>Quantity</h4>
                            </div>
                            <div className='ms-28'>
                                <h5>Price</h5>
                            </div>
                        </div>
                    </div>
                    <div className='h-[51vh] overflow-y-auto'>
                        {order.items.length > 0 ? (
                            order.items.map((item) => {
                                // Find the admin by adminId
                                const admin = admins.find(admin => admin._id === item.adminId);
                                const shopLogo = admin ? admin.shopLogo : ''; // Get shopLogo if admin exists

                                return (
                                    <div key={item._id} className='flex bg-white p-3 my-2 rounded-lg border'>
                                        <div className='w-[38%] grid grid-cols-2'>
                                            <div className='flex items-center'>
                                                <img src={item.imgURL[0]} className='w-10 h-9 mr-2' alt={item.productName} />
                                                <h1 className='font-semibold'>{item.productName}</h1>
                                            </div>
                                            {shopLogo && (
                                                <div className='flex items-center ml-7'>
                                                    <img src={shopLogo} alt="Shop Logo" className='w-8 h-8 rounded-full' />
                                                </div>
                                            )}
                                        </div>
                                        <div className='grid grid-cols-3 gap-5 w-[38%] mt-1'>
                                            <ColorDisplay colorHex={item.selectedColor} />
                                            <p>{item.selectedSize}</p>
                                            <input
                                                type="number"
                                                min="0"
                                                value={quantities[item.uniqueId] !== undefined ? quantities[item.uniqueId] : item.quantity}
                                                onChange={(e) => handleQuantityChange(item.uniqueId, e.target.value)}
                                                disabled={order.status === 'completed' || order.status === 'declined' || role === 'super admin'}
                                                className="border p-1 rounded"
                                            />
                                        </div>
                                        <div className='w-[24%] flex items-center'>
                                            <p className='ms-24 mt-1'>{item.price} mmk</p>
                                            {role !== 'super admin' && (
                                                <RiDeleteBin7Fill
                                                    className='ms-20 text-red-500 cursor-pointer'
                                                    onClick={() => handleDeleteItem(item.uniqueId)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className='text-center'>No items in this order.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
