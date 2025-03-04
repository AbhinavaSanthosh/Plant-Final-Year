import { message } from "antd";
import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { GetProducts } from "../../Apicalls/products";
import Error from "../../components/Error";
import Pagination from "../../components/Pagination";
import { SetLoader } from "../../redux/LoadersSlice";
import bgVideo from "../videos/forest.mp4";
import Chatbot from "./Chatbot";
import Filters from "./Filters";
import ProductCard from "./ProductCard";
import Search from "./Search";


const Home = () => {
    const [showFilters, setShowFilters] = useState(true);
    const [showChatbot, setShowChatbot] = useState(false);
    const [error, setError] = useState(false);
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        status: "available",
        category: [],
        age: [],
        location: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage, setPostPerPage] = useState(8);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts(filters);
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.data);
            } else {
                throw new Error("Products not found");
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    useEffect(() => {
        getData();
    }, [filters]);

    const lastPostIndex = currentPage * postPerPage;
    const firstPostIndex = lastPostIndex - postPerPage;
    const currentPosts = products.slice(firstPostIndex, lastPostIndex);

    return (
        <div className="relative min-h-screen">
            {/* Background Video */}
            {/* <div className="absolute -z-50">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={bgVideo} type="video/mp4" />
                </video>
            </div> */}

            {/* Overlay to Improve Readability */}
            <div className="absolute inset-0 bg-black opacity-40 -z-40"></div>

            {/* Main Content */}
            <div className="relative z-10 flex gap-5 p-5">
                {/* Filters */}
                {showFilters && (
                    <Filters
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        filters={filters}
                        setFilters={setFilters}
                    />
                )}

                {/* Main Content */}
                <div className="flex flex-col gap-5 w-full">
                    {/* Header with Filter and Chatbot Toggle */}
                    <div className="flex gap-5 items-center">
                        {!showFilters && (
                            <IoFilterSharp
                                size={30}
                                color="white"
                                className="cursor-pointer"
                                onClick={() => setShowFilters(!showFilters)}
                            />
                        )}
                        <Search setProducts={setProducts} reloadData={getData} setError={setError} />
                        {/* Chatbot Toggle Button */}
                        <button
                            className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                            onClick={() => {
                                setShowChatbot(!showChatbot);
                                if (showChatbot) setSelectedPlant(null);
                            }}
                        >
                            <FaRobot size={20} />
                            {showChatbot ? "Hide Chatbot" : "Show Chatbot"}
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div
                        className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${showFilters ? "grid-cols-3" : "grid-cols-4"}`}
                    >
                        <ProductCard
                            products={currentPosts}
                            onPlantClick={(plant) => {
                                setSelectedPlant(plant);
                                setShowChatbot(true);
                            }}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center mt-3">
                        <Pagination
                            totalPosts={products.length}
                            postsPerPage={postPerPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>

                {/* Chatbot */}
                {showChatbot && (
                    <div className="fixed right-5 bottom-5 w-96 max-h-96 bg-white shadow-lg rounded-lg p-5 z-50">
                        <Chatbot selectedPlant={selectedPlant} />
                    </div>
                )}
            </div>
        </div>

    );
};

export default Home;
