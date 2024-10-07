import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '../config/firebase';

const Shop = ({token}) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputName, setInputName] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputShopName, setInputShopName] = useState('');
    const [inputShopAddress, setInputShopAddress] = useState('');
    const [inputShopPhone, setInputShopPhone] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [role, setRole] = useState('shop admin');

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const togglePasswordVisibility = () => {
        setVisible(!visible);
    };

    const goToShopPage = () => {
        setShowImageUpload(true);
    };

    const goToAdminPage = () => {
        setShowImageUpload(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const uploadImagesToFirebase = async(file) => {
        const imageRef = ref(storage, `logos/${file.name}`);
        await uploadBytes(imageRef, file);
        const imgURL = await getDownloadURL(imageRef);
        return imgURL;
    }

    const signUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const fileInput = document.querySelector('input[type="file"]');
            const file = fileInput.files[0];

            // Upload image to Firebase and get URL
            const imgURL = await uploadImagesToFirebase(file);


            const response = await axios.post('http://localhost:8090/api/adminuser/create', {
                username: inputName,
                password: inputPassword,
                role, 
                shopName: inputShopName,
                shopAddress: inputShopAddress,
                shopPhone: inputShopPhone,
                shopLogo: imgURL,
            }, {
                headers: {
                    'x-access-token': token,
                },
            });

            if (response.data.success) {
                Toastify({
                    text: "Admin user created successfully",
                    backgroundColor: "green",
                }).showToast();
            }
            setInputName("");
            setInputPassword("");
            setInputShopName("");
            setInputShopAddress("");
            setInputShopPhone("");
            setPreviewImage("");
        } catch (error) {
            Toastify({
                text: "Error creating admin user",
                backgroundColor: "red",
            }).showToast();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen flex'>
            {loading && <Spinner />}
            {!showImageUpload && (
                <>
                    <Sidebar />
                    <div className='sideB w-full h-full flex justify-center items-center'>
                        <div className='bg-slate-200 p-5 w-[30%]'>
                            <h1 className='text-center text-2xl mb-5 text-slate-500'>CREATE SHOP ADMIN</h1>
                            <div>
                                <input
                                    type='text'
                                    placeholder='Username'
                                    value={inputName}
                                    onChange={(e) => setInputName(e.target.value)}
                                    className='w-full p-2 mb-5 outline-none'
                                    required
                                />
                                <div className='relative'>
                                    <input
                                        type={visible ? 'text' : 'password'}
                                        placeholder='Password'
                                        value={inputPassword}
                                        onChange={(e) => setInputPassword(e.target.value)}
                                        className='w-full p-2 mb-5 outline-none'
                                        required
                                    />
                                    <FontAwesomeIcon
                                        className='absolute right-2 top-3 cursor-pointer text-slate-300'
                                        icon={visible ? faEyeSlash : faEye}
                                        onClick={togglePasswordVisibility}
                                    />
                                </div>
                                <button
                                    className='bg-lime-600 p-2 w-full text-white text-lg'
                                    onClick={goToShopPage}
                                    disabled={loading}
                                >
                                    Go To Shop Page
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showImageUpload && (
                <>
                    <Sidebar />
                    <div className='sideB w-full h-full'>
                        <div className='text-center m-20'>
                            <button
                                className='bg-lime-600 p-2 text-white text-lg'
                                onClick={goToAdminPage}
                                disabled={loading}
                            >
                                Go To Admin Page
                            </button>
                        </div>
                        <div className='w-[55%] h-[45%] m-auto flex'>
                            <div className='bg-slate-700 h-[100%] w-[40%] flex flex-col items-center justify-center'>
                                <div className='bg-slate-50 h-[85%] w-full flex items-center justify-center'>
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className='h-full w-full' />
                                    ) : (
                                        <span className="text-gray-500">No image selected</span>
                                    )}
                                </div>
                                <div className="relative flex justify-center items-center h-10 w-full">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    <span className="text-white">Add Logo Image</span>
                                </div>
                            </div>
                            <div className='w-[55%] h-[100%] bg-slate-300'>
                                <div className='h-[82%]'>
                                    <div className='w-full pt-5 px-10'>
                                        <label>Name</label>
                                        <input
                                            type='text'
                                            className='w-full mt-1 p-1 rounded-md outline-none'
                                            value={inputShopName}
                                            onChange={(e) => setInputShopName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='w-full pt-5 px-10'>
                                        <label>Address</label>
                                        <input
                                            type='text'
                                            className='w-full mt-1 p-1 rounded-md outline-none'
                                            value={inputShopAddress}
                                            onChange={(e) => setInputShopAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='w-full pt-5 px-10 mb-6'>
                                        <label>Phone Number</label>
                                        <input
                                            type='text'
                                            className='w-full mt-1 p-1 rounded-md outline-none'
                                            value={inputShopPhone}
                                            onChange={(e) => setInputShopPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='text-center'>
                                    <button className='bg-lime-600 px-7 py-2 text-white rounded-md' onClick={signUp}>
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Shop;
