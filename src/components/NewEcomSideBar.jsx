import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';

const NewEcomSideBar = ({ onFilterChange }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isSubcategoryOpen, setIsSubcategoryOpen] = useState({});
    const [isCityOpen, setIsCityOpen] = useState(true);
    const [isRatingOpen, setIsRatingOpen] = useState(true);
    const [isExperienceOpen, setIsExperienceOpen] = useState(true);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [cities, setCities] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);

    const prevFiltersRef = useRef({
        categories: [],
        subcategories: [],
        cities: [],
        ratings: [],
        experience: [],
    });

    const ratingOptions = [
        { label: "4.5 Ulduz və Üzəri", value: "4.5" },
        { label: "4 Ulduz və Üzəri", value: "4" },
        { label: "3 Ulduz və Üzəri", value: "3" },
        { label: "2 Ulduz və Üzəri", value: "2" },
        { label: "1 Ulduz və Üzəri", value: "1" },
    ];

    const experienceOptions = [
        { label: "10-15 il", value: "10-15" },
        { label: "5-10 il", value: "5-10" },
        { label: "1-3 il", value: "1-3" },
    ];

    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const [categoriesRes, citiesRes, servicesRes] = await Promise.all([
                    fetch("https://api.peshekar.online/api/v1/categories/"),
                    fetch("https://api.peshekar.online/api/v1/cities/"),
                    fetch("https://api.peshekar.online/api/v1/services/"),
                ]);

                const categoriesData = await categoriesRes.json();
                const citiesData = await citiesRes.json();
                const servicesData = await servicesRes.json();

                const subcategoriesByCategory = {};
                servicesData.forEach(service => {
                    const categoryId = service.category?.id;
                    if (categoryId) {
                        if (!subcategoriesByCategory[categoryId]) {
                            subcategoriesByCategory[categoryId] = [];
                        }
                        subcategoriesByCategory[categoryId].push({
                            id: service.id,
                            name: service.display_name
                        });
                    }
                });

                setCategories(categoriesData.results || categoriesData);
                setCities(citiesData.results || citiesData);
                setSubcategories(subcategoriesByCategory);
            } catch (error) {
                console.error("Error fetching filter data:", error);
            }
        };
        fetchFilterData();
    }, []);

    useEffect(() => {
        const selectedCategory = localStorage.getItem('selectedCategory');
        const selectedSubcategory = localStorage.getItem('selectedSubcategory');
        const shouldExpand = localStorage.getItem('shouldExpandCategories');

        if (shouldExpand) {
            setIsCategoryOpen(true);
            localStorage.removeItem('shouldExpandCategories');
        }

        if (selectedCategory) {
            setSelectedCategories([parseInt(selectedCategory)]);
            localStorage.removeItem('selectedCategory');
        }

        if (selectedSubcategory) {
            setSelectedSubcategories([parseInt(selectedSubcategory)]);
            localStorage.removeItem('selectedSubcategory');
        }
    }, []);

    useEffect(() => {
        const currentFilters = {
            categories: selectedCategories,
            subcategories: selectedSubcategories,
            cities: selectedCities,
            ratings: selectedRatings,
            experience: selectedExperience,
        };

        const areArraysEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            const sortedArr1 = [...arr1].sort();
            const sortedArr2 = [...arr2].sort();
            for (let i = 0; i < sortedArr1.length; i++) {
                if (sortedArr1[i] !== sortedArr2[i]) return false;
            }
            return true;
        };

        const prevFilters = prevFiltersRef.current;

        if (
            !areArraysEqual(prevFilters.categories, currentFilters.categories) ||
            !areArraysEqual(prevFilters.subcategories, currentFilters.subcategories) ||
            !areArraysEqual(prevFilters.cities, currentFilters.cities) ||
            !areArraysEqual(prevFilters.ratings, currentFilters.ratings) ||
            !areArraysEqual(prevFilters.experience, currentFilters.experience)
        ) {
            onFilterChange(currentFilters);
            prevFiltersRef.current = currentFilters;
        }
    }, [
        selectedCategories,
        selectedSubcategories,
        selectedCities,
        selectedRatings,
        selectedExperience,
        onFilterChange,
    ]);

    const toggleSubcategory = (categoryId) => {
        setIsSubcategoryOpen(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubcategoryChange = (subcategoryId) => {
        setSelectedSubcategories(prev =>
            prev.includes(subcategoryId)
                ? prev.filter(id => id !== subcategoryId)
                : [...prev, subcategoryId]
        );
    };

    const handleCityChange = (cityId) => {
        setSelectedCities(prev =>
            prev.includes(cityId)
                ? prev.filter(id => id !== cityId)
                : [...prev, cityId]
        );
    };

    const handleRatingChange = (ratingValue) => {
        setSelectedRatings(prev =>
            prev.includes(ratingValue)
                ? prev.filter(val => val !== ratingValue)
                : [...prev, ratingValue]
        );
    };

    const handleExperienceChange = (experienceValue) => {
        setSelectedExperience(prev =>
            prev.includes(experienceValue)
                ? prev.filter(val => val !== experienceValue)
                : [...prev, experienceValue]
        );
    };

    return (
        <div className='ecom-sidebar w-[223px] flex flex-col gap-2.5'>
            <div className="sidebar-job">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer'
                >
                    Peşə sahəsi
                    {isCategoryOpen ? (
                        <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
                    ) : (
                        <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
                    )}
                </button>
                {isCategoryOpen && (
                    <form action="" className='flex flex-col'>
                        {categories.map(category => (
                            <div key={category.id} className="category-group">
                                <div className='flex items-center gap-2 p-4'>
                                    <input
                                        type="checkbox"
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryChange(category.id)}
                                        className='size-5'
                                    />
                                    <label
                                        htmlFor={`category-${category.id}`}
                                        className='text-[16px] font-semibold flex-grow'
                                    >
                                        {category.display_name || category.name}
                                    </label>
                                    {subcategories[category.id] && (
                                        <button
                                            type="button"
                                            onClick={() => toggleSubcategory(category.id)}
                                            className="subcategory-toggle"
                                        >
                                            {isSubcategoryOpen[category.id] ? (
                                                <MdOutlineKeyboardArrowUp />
                                            ) : (
                                                <MdOutlineKeyboardArrowDown />
                                            )}
                                        </button>
                                    )}
                                </div>

                                {isSubcategoryOpen[category.id] && subcategories[category.id] && (
                                    <div className="subcategory-list pl-8">
                                        {subcategories[category.id].map(subcategory => (
                                            <div key={subcategory.id} className='flex items-center gap-2 p-2 pl-6'>
                                                <input
                                                    type="checkbox"
                                                    id={`subcategory-${subcategory.id}`}
                                                    checked={selectedSubcategories.includes(subcategory.id)}
                                                    onChange={() => handleSubcategoryChange(subcategory.id)}
                                                    className='size-4'
                                                />
                                                <label
                                                    htmlFor={`subcategory-${subcategory.id}`}
                                                    className='text-[14px] font-medium'
                                                >
                                                    {subcategory.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </form>
                )}
            </div>

            <div className="sidebar-city">
                <button
                    onClick={() => setIsCityOpen(!isCityOpen)}
                    className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer'
                >
                    Şəhər/Rayon
                    {isCityOpen ? (
                        <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
                    ) : (
                        <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
                    )}
                </button>
                {isCityOpen && (
                    <form action="" className='flex flex-col'>
                        {cities.map(city => (
                            <div key={city.id} className='flex items-center gap-2 p-4'>
                                <input
                                    type="checkbox"
                                    id={`city-${city.id}`}
                                    checked={selectedCities.includes(city.id)}
                                    onChange={() => handleCityChange(city.id)}
                                    className='size-5'
                                />
                                <label
                                    htmlFor={`city-${city.id}`}
                                    className='text-[16px] font-semibold'
                                >
                                    {city.display_name || city.name}
                                </label>
                            </div>
                        ))}
                    </form>
                )}
            </div>

            <div className="sidebar-rating">
                <button
                    onClick={() => setIsRatingOpen(!isRatingOpen)}
                    className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer'
                >
                    Reytinqi
                    {isRatingOpen ? (
                        <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
                    ) : (
                        <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
                    )}
                </button>
                {isRatingOpen && (
                    <form action="" className='flex flex-col'>
                        {ratingOptions.map(option => (
                            <div key={option.value} className='flex items-center gap-2 p-4'>
                                <input
                                    type="checkbox"
                                    id={`rating-${option.value}`}
                                    checked={selectedRatings.includes(option.value)}
                                    onChange={() => handleRatingChange(option.value)}
                                    className='size-5'
                                />
                                <label htmlFor={`rating-${option.value}`} className='text-[16px] font-semibold'>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </form>
                )}
            </div>

            <div className="sidebar-year">
                <button
                    onClick={() => setIsExperienceOpen(!isExperienceOpen)}
                    className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer'
                >
                    Təcrübə ili
                    {isExperienceOpen ? (
                        <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
                    ) : (
                        <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
                    )}
                </button>
                {isExperienceOpen && (
                    <form action="" className='flex flex-col'>
                        {experienceOptions.map(option => (
                            <div key={option.value} className='flex items-center gap-2 p-4'>
                                <input
                                    type="checkbox"
                                    id={`experience-${option.value}`}
                                    checked={selectedExperience.includes(option.value)}
                                    onChange={() => handleExperienceChange(option.value)}
                                    className='size-5'
                                />
                                <label htmlFor={`experience-${option.value}`} className='text-[16px] font-semibold'>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </form>
                )}
            </div>
        </div>
    );
};

export default NewEcomSideBar;































// import React, { useState, useEffect, useRef } from "react";
// import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md'

// const NewEcomSideBar = ({ onFilterChange }) => {

//     const [isCategoryOpen, setIsCategoryOpen] = useState(true);
//     const [isCityOpen, setIsCityOpen] = useState(true);
//     const [isRatingOpen, setIsRatingOpen] = useState(true);
//     const [isExperienceOpen, setIsExperienceOpen] = useState(true);

//     const [categories, setCategories] = useState([]);
//     const [cities, setCities] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedCities, setSelectedCities] = useState([]);
//     const [selectedRatings, setSelectedRatings] = useState([]);
//     const [selectedExperience, setSelectedExperience] = useState([]);

//     const prevFiltersRef = useRef({
//         categories: [],
//         cities: [],
//         ratings: [],
//         experience: [],
//     });

//     const ratingOptions = [
//         { label: "4.5 Ulduz və Üzəri", value: "4.5" },
//         { label: "4 Ulduz və Üzəri", value: "4" },
//         { label: "3 Ulduz və Üzəri", value: "3" },
//         { label: "2 Ulduz və Üzəri", value: "2" },
//         { label: "1 Ulduz və Üzəri", value: "1" },
//     ];

//     const experienceOptions = [
//         { label: "10-15 il", value: "10-15" },
//         { label: "5-10 il", value: "5-10" },
//         { label: "1-3 il", value: "1-3" },
//     ];

//     useEffect(() => {
//         const fetchFilterData = async () => {
//             try {
//                 const [categoriesRes, citiesRes, servicesRes] = await Promise.all([
//                     fetch("https://api.peshekar.online/api/v1/categories/"),
//                     fetch("https://api.peshekar.online/api/v1/cities/"),
//                     fetch("https://api.peshekar.online/api/v1/services/"),
//                 ]);

//                 const categoriesData = await categoriesRes.json();
//                 const citiesData = await citiesRes.json();
//                 const servicesData = await servicesRes.json();

//                 setCategories(categoriesData.results || categoriesData);
//                 setCities(citiesData.results || citiesData);
//             } catch (error) {
//                 console.error("Error fetching filter data:", error);
//             }
//         };
//         fetchFilterData();
//     }, []);

//     useEffect(() => {
//         const currentFilters = {
//             categories: selectedCategories,
//             cities: selectedCities,
//             ratings: selectedRatings,
//             experience: selectedExperience,
//         };

//         const areArraysEqual = (arr1, arr2) => {
//             if (arr1.length !== arr2.length) return false;
//             const sortedArr1 = [...arr1].sort();
//             const sortedArr2 = [...arr2].sort();
//             for (let i = 0; i < sortedArr1.length; i++) {
//                 if (sortedArr1[i] !== sortedArr2[i]) return false;
//             }
//             return true;
//         };

//         const prevFilters = prevFiltersRef.current;

//         if (
//             !areArraysEqual(prevFilters.categories, currentFilters.categories) ||
//             !areArraysEqual(prevFilters.cities, currentFilters.cities) ||
//             !areArraysEqual(prevFilters.ratings, currentFilters.ratings) ||
//             !areArraysEqual(prevFilters.experience, currentFilters.experience)
//         ) {
//             onFilterChange(currentFilters);
//             prevFiltersRef.current = currentFilters;
//         }
//     }, [
//         selectedCategories,
//         selectedCities,
//         selectedRatings,
//         selectedExperience,
//         onFilterChange,
//     ]);

//     const handleCategoryChange = (categoryId) => {
//         setSelectedCategories((prev) =>
//             prev.includes(categoryId)
//                 ? prev.filter((id) => id !== categoryId)
//                 : [...prev, categoryId]
//         );
//     };

//     const handleCityChange = (cityId) => {
//         setSelectedCities((prev) =>
//             prev.includes(cityId)
//                 ? prev.filter((id) => id !== cityId)
//                 : [...prev, cityId]
//         );
//     };

//     const handleRatingChange = (ratingValue) => {
//         setSelectedRatings((prev) =>
//             prev.includes(ratingValue)
//                 ? prev.filter((val) => val !== ratingValue)
//                 : [...prev, ratingValue]
//         );
//     };

//     const handleExperienceChange = (experienceValue) => {
//         setSelectedExperience((prev) =>
//             prev.includes(experienceValue)
//                 ? prev.filter((val) => val !== experienceValue)
//                 : [...prev, experienceValue]
//         );
//     };


//     return (
//         <div className='ecom-sidebar w-[223px] flex flex-col gap-2.5'>
//             <div className="sidebar-job">
//                 <button
//                     onClick={() => setIsCategoryOpen(!isCategoryOpen)}
//                     className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer'
//                 >
//                     Peşə sahəsi
//                     {isCategoryOpen ? (
//                         <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
//                     ) : (
//                         <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
//                     )}</button>
//                 {isCategoryOpen && (
//                     <form action="" className='flex flex-col'>
//                         {/* <input type="text" placeholder='Peşə daxil edin' className='border-1 border-[#404653] rounded-[7px] p-2.5 my-2.5 font-semibold text-[16px] outline-0' /> */}
//                         {categories.map(category => (
//                             <div key={category.id} className='flex items-center gap-2 p-4'>
//                                 <input
//                                     type="checkbox"
//                                     id={`category-${category.id}`}
//                                     checked={selectedCategories.includes(category.id)}
//                                     onChange={() => handleCategoryChange(category.id)}
//                                     className='size-5' />
//                                 <label
//                                     htmlFor={`category-${category.id}`}
//                                     className='text-[16px] font-semibold'
//                                 >
//                                     {category.display_name || category.name}
//                                 </label>
//                             </div>
//                         ))}
//                     </form>
//                 )}

//             </div>
//             <div className="sidebar-city">
//                 <button
//                     onClick={() => setIsCityOpen(!isCityOpen)}
//                     className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653]  hover:bg-gray-100 cursor-pointer'
//                 >
//                     Şəhər/Rayon
//                     {isCityOpen ? (
//                         <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
//                     ) : (
//                         <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
//                     )}
//                 </button>
//                 {isCityOpen && (
//                     <form action="" className='flex flex-col'>
//                         {/* <input type="text" placeholder='Şəhər daxil edin' className='border-1 border-[#404653] rounded-[7px] p-2.5 my-2.5 font-semibold text-[16px] outline-0' /> */}
//                         {cities.map(city => (
//                             <div key={city.id} className='flex items-center gap-2 p-4'>
//                                 <input
//                                     type="checkbox"
//                                     id={`city-${city.id}`}
//                                     checked={selectedCities.includes(city.id)}
//                                     onChange={() => handleCityChange(city.id)}
//                                     className='size-5' />
//                                 <label
//                                     htmlFor={`city-${city.id}`}
//                                     className='text-[16px] font-semibold'
//                                 >
//                                     {city.display_name || city.name}
//                                 </label>
//                             </div>
//                         ))}

//                     </form>
//                 )}

//             </div>
//             <div className="sidebar-rating">
//                 <button
//                     onClick={() => setIsRatingOpen(!isRatingOpen)}
//                     className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653]  hover:bg-gray-100 cursor-pointer'
//                 >
//                     Reytinqi
//                     {isRatingOpen ? (
//                         <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
//                     ) : (
//                         <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
//                     )}
//                 </button>
//                 {isRatingOpen && (
//                     <form action="" className='flex flex-col'>
//                         {ratingOptions.map((option) => (
//                             <div key={option.value} className='flex items-center gap-2 p-4'>
//                                 <input
//                                     type="checkbox"
//                                     id={`rating-${option.value}`}
//                                     checked={selectedRatings.includes(option.value)}
//                                     onChange={() => handleRatingChange(option.value)}
//                                     className='size-5'
//                                 />
//                                 <label htmlFor={`rating-${option.value}`} className='text-[16px] font-semibold'>
//                                     {option.label}
//                                 </label>
//                             </div>
//                         ))}
//                     </form>
//                 )}

//             </div>
//             <div className="sidebar-year">
//                 <button
//                     onClick={() => setIsExperienceOpen(!isExperienceOpen)}
//                     className='w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653]  hover:bg-gray-100 cursor-pointer'
//                 >
//                     Təcrübə ili
//                     {isExperienceOpen ? (
//                         <MdOutlineKeyboardArrowUp className='text-2xl text-[#7A8599]' />
//                     ) : (
//                         <MdOutlineKeyboardArrowDown className='text-2xl text-[#7A8599]' />
//                     )}
//                 </button>
//                 {isExperienceOpen && (
//                     <form action="" className='flex flex-col'>
//                         {experienceOptions.map((option) => (
//                             <div key={option.value} className='flex items-center gap-2 p-4'>
//                                 <input
//                                     type="checkbox"
//                                     id={`experience-${option.value}`}
//                                     checked={selectedExperience.includes(option.value)}
//                                     onChange={() => handleExperienceChange(option.value)}
//                                     className='size-5'
//                                 />
//                                 <label htmlFor={`experience-${option.value}`} className='text-[16px] font-semibold'>
//                                     {option.label}
//                                 </label>
//                             </div>
//                         ))}
//                     </form>
//                 )}

//             </div>
//         </div>
//     )
// }

// export default NewEcomSideBar
