import React, { useState, useEffect, useRef } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

const NewEcomSideBar = ({ onFilterChange }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState({});
  const [isCityOpen, setIsCityOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cityShowAll, setCityShowAll] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const prevFiltersRef = useRef({
    categories: [],
    subcategories: [],
    cities: [],
  });

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
        servicesData.forEach((service) => {
          const categoryId = service.category?.id;
          if (categoryId) {
            if (!subcategoriesByCategory[categoryId]) {
              subcategoriesByCategory[categoryId] = [];
            }
            subcategoriesByCategory[categoryId].push({
              id: service.id,
              name: service.display_name,
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
    const selectedCategoryFromLS = localStorage.getItem("selectedCategory");
    const selectedSubcategoryFromLS = localStorage.getItem(
      "selectedSubcategory"
    );
    const shouldExpand = localStorage.getItem("shouldExpandCategories");

    if (shouldExpand) {
      setIsCategoryOpen(true);
      localStorage.removeItem("shouldExpandCategories");
    }

    if (selectedCategoryFromLS && !selectedSubcategoryFromLS) {
      const catId = Number.parseInt(selectedCategoryFromLS);
      setSelectedCategories([catId]);
      localStorage.removeItem("selectedCategory");
    }

    if (selectedSubcategoryFromLS) {
      const subCatId = Number.parseInt(selectedSubcategoryFromLS);
      setSelectedSubcategories([subCatId]);
      localStorage.removeItem("selectedSubcategory");

      for (const categoryId in subcategories) {
        if (subcategories[categoryId]?.some((sub) => sub.id === subCatId)) {
          setIsSubcategoryOpen((prev) => ({ ...prev, [categoryId]: true }));
          setIsCategoryOpen(true);
          break;
        }
      }
    }
  }, [subcategories]);

  useEffect(() => {
    const currentFilters = {
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      cities: selectedCities,
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
      !areArraysEqual(
        prevFilters.subcategories,
        currentFilters.subcategories
      ) ||
      !areArraysEqual(prevFilters.cities, currentFilters.cities)
    ) {
      onFilterChange(currentFilters);
      prevFiltersRef.current = currentFilters;
    }
  }, [
    selectedCategories,
    selectedSubcategories,
    selectedCities,
    onFilterChange,
  ]);

  const toggleSubcategory = (categoryId) => {
    setIsSubcategoryOpen((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) => {
      const isCurrentlySelected = prev.includes(categoryId);
      const newSelectedCategories = isCurrentlySelected
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      if (isCurrentlySelected) {
        setSelectedSubcategories((prevSub) => {
          const subcategoriesOfThisCategory =
            subcategories[categoryId]?.map((sub) => sub.id) || [];
          return prevSub.filter(
            (subId) => !subcategoriesOfThisCategory.includes(subId)
          );
        });
      }
      return newSelectedCategories;
    });
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleCityChange = (cityId) => {
    setSelectedCities((prev) =>
      prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId]
    );
  };

  return (
    <div className="ecom-sidebar w-[223px] flex flex-col gap-2.5">
      <div className="sidebar-job">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer"
        >
          Peşə sahəsi
          {isCategoryOpen ? (
            <MdOutlineKeyboardArrowUp className="text-2xl text-[#7A8599]" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-2xl text-[#7A8599]" />
          )}
        </button>
        {isCategoryOpen && (
          <form action="" className="flex flex-col">
            <input
              type="text"
              placeholder="Peşə daxil edin"
              className="border-1 border-[#404653] rounded-[7px] p-2.5 my-2.5 font-semibold text-[16px] outline-0"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
            />
            {categories
              .filter((category) =>
                (category.display_name || category.name)
                  .toLowerCase()
                  .includes(categorySearch.toLowerCase())
              )
              .map((category) => (
                <div key={category.id} className="category-group">
                  <div className="relative flex items-center gap-2 p-4">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-[16px] font-semibold flex-grow"
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
                  {isSubcategoryOpen[category.id] &&
                    subcategories[category.id] && (
                      <div className="subcategory-list pl-8">
                        {subcategories[category.id].map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className="relative flex items-center gap-2 p-2 pl-6"
                          >
                            <input
                              type="checkbox"
                              id={`subcategory-${subcategory.id}`}
                              checked={selectedSubcategories.includes(
                                subcategory.id
                              )}
                              onChange={() =>
                                handleSubcategoryChange(subcategory.id)
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="text-[14px] font-medium"
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
          className="w-full flex justify-between items-center text-black font-semibold text-xl p-4 border-b-1 border-[#404653] hover:bg-gray-100 cursor-pointer"
        >
          Şəhər/Rayon
          {isCityOpen ? (
            <MdOutlineKeyboardArrowUp className="text-2xl text-[#7A8599]" />
          ) : (
            <MdOutlineKeyboardArrowDown className="text-2xl text-[#7A8599]" />
          )}
        </button>
        {isCityOpen && (
          <form action="" className="flex flex-col">
            <input
              type="text"
              placeholder="Şəhər daxil edin"
              className="border-1 border-[#404653] rounded-[7px] p-2.5 my-2.5 font-semibold text-[16px] outline-0"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
            />
            {cities
              .filter((city) =>
                (city.display_name || city.name)
                  .toLowerCase()
                  .includes(citySearch.toLowerCase())
              )
              .slice(0, cityShowAll ? undefined : 11)
              .map((city) => (
                <div
                  key={city.id}
                  className="relative flex items-center gap-2 p-4"
                >
                  <input
                    type="checkbox"
                    id={`city-${city.id}`}
                    checked={selectedCities.includes(city.id)}
                    onChange={() => handleCityChange(city.id)}
                    className="size-5"
                  />
                  <label
                    htmlFor={`city-${city.id}`}
                    className="text-[16px] font-semibold"
                  >
                    {city.display_name || city.name}
                  </label>
                </div>
              ))}
            {cities.filter((city) =>
              (city.display_name || city.name)
                .toLowerCase()
                .includes(citySearch.toLowerCase())
            ).length > 11 && (
              <button
                type="button"
                className="w-fit self-center px-4 py-1.5 mt-2 rounded-[7px] border border-[#404653] bg-white text-[#404653] font-semibold text-[15px] transition hover:bg-[#404653] hover:text-white"
                style={{ alignSelf: "Flex-start" }}
                onClick={() => setCityShowAll((prev) => !prev)}
              >
                {cityShowAll ? "Daha az göstər" : "Daha çox göstər"}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default NewEcomSideBar;
