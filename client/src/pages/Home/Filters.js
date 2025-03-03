import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import locations from "../../data/locations.json";

const categories = [
    { name: "Medicinal Plants", value: "medicinal" },
    { name: "Flowering Plants", value: "flowering" },
    { name: "Fruit Plants", value: "fruit" },
    { name: "Bouquets", value: "bouquet" },
    { name: "Indoor Plants", value: "indoor" },
    { name: "Air Purifying Plants", value: "air" },
    
];

const ages = [
    { name: "0-2 Month/Year old", value: "0-2" },
    { name: "3-5 Month/Year old", value: "3-5" },
    { name: "6-8 Month/Year old", value: "6-8" },
    { name: "9-12 Month/Year old", value: "9-12" },
    { name: "13+ Month/Year old", value: "12-20" },
];

const Filters = ({ showFilters, setShowFilters, filters, setFilters }) => {
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showAgeDropdown, setShowAgeDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [filteredLocations, setFilteredLocations] = useState(locations);

    return (
        <div className="w-80 bg-[rgba(218,220,221,0.65)] shadow-lg rounded-lg p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold text-gray-800">Filters</h1>
                <RxCross2
                    size={21}
                    className="text-gray-600 cursor-pointer hover:text-gray-800"
                    onClick={() => setShowFilters(!showFilters)}
                />
            </div>

            {/* Categories Dropdown */}
            <div className="mb-5">
                <div
                    className="flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                    <h1 className="text-sm font-medium text-gray-700">Categories</h1>
                    {showCategoryDropdown ? (
                        <FaChevronUp size={14} className="text-gray-500" />
                    ) : (
                        <FaChevronDown size={14} className="text-gray-500" />
                    )}
                </div>

                {showCategoryDropdown && (
                    <div className="mt-2 pl-2 space-y-2">
                        {categories.map((category, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={filters.category.includes(category.value)}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            category: e.target.checked
                                                ? [...filters.category, category.value]
                                                : filters.category.filter((item) => item !== category.value),
                                        });
                                    }}
                                />
                                <label className="text-sm text-gray-700">{category.name}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ages Dropdown */}
            <div className="mb-5">
                <div
                    className="flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setShowAgeDropdown(!showAgeDropdown)}
                >
                    <h1 className="text-sm font-medium text-gray-700">Ages</h1>
                    {showAgeDropdown ? (
                        <FaChevronUp size={14} className="text-gray-500" />
                    ) : (
                        <FaChevronDown size={14} className="text-gray-500" />
                    )}
                </div>

                {showAgeDropdown && (
                    <div className="mt-2 pl-2 space-y-2">
                        {ages.map((age, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={filters.age.includes(age.value)}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            age: e.target.checked
                                                ? [...filters.age, age.value]
                                                : filters.age.filter((item) => item !== age.value),
                                        });
                                    }}
                                />
                                <label className="text-sm text-gray-700">{age.name}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Locations Dropdown */}
            <div className="mb-5">
                <div
                    className="flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                    <h1 className="text-sm font-medium text-gray-700">Locations</h1>
                    {showLocationDropdown ? (
                        <FaChevronUp size={14} className="text-gray-500" />
                    ) : (
                        <FaChevronDown size={14} className="text-gray-500" />
                    )}
                </div>

                {showLocationDropdown && (
                    <div className="mt-2">
                        {/* Search Bar */}
                        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg mb-3">
                            <FaSearch className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search Location"
                                className="w-full px-2 py-1 text-sm text-gray-700 bg-transparent focus:outline-none"
                                onChange={(e) => {
                                    const search = e.target.value.toLowerCase();
                                    const newFilteredLocations = locations.filter((loc) =>
                                        loc.toLowerCase().includes(search)
                                    );
                                    setFilteredLocations(newFilteredLocations);
                                }}
                            />
                        </div>

                        {/* Location List */}
                        <div className="h-64 overflow-y-auto pl-2 space-y-2">
                            {filteredLocations.map((loc, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                        checked={filters.location.includes(loc)}
                                        onChange={(e) => {
                                            setFilters({
                                                ...filters,
                                                location: e.target.checked
                                                    ? [...filters.location, loc]
                                                    : filters.location.filter((item) => item !== loc),
                                            });
                                        }}
                                    />
                                    <label className="text-sm text-gray-700">{loc}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filters;