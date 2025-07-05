import React, { useState, useEffect, useCallback } from "react";
import EcomCard from "../components/EcomCard";
import { CheckCircle, User, Star, ArrowUpDown, Search } from "lucide-react";

import Footer from "../components/Footer";
import Header from "../home/Components/Header";
import NewEcomSideBar from "../components/NewEcomSideBar"

export default function Ecom() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Ən son yüklənən");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    experienced: false,
    new: false,
    mostViewed: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalProfessionals, setTotalProfessionals] = useState(0);

  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    cities: [],
    ratings: [],
    experience: [],
  });

  const [categoryMap, setCategoryMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [cityMap, setCityMap] = useState({});

  const sortOptions = [
    
    { label: "Sənə ən yaxın", value: "closest" },
    { label: "Ən son yüklənən", value: "newest" },
    { label: "Ən reytinqli", value: "top_rated" },
    { label: "Tövsiyə olunan", value: "recommended" },
  ];

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const [categoriesRes, servicesRes, citiesRes] = await Promise.all([
          fetch("https://api.peshekar.online/api/v1/categories/"),
          fetch("https://api.peshekar.online/api/v1/services/"),
          fetch("https://api.peshekar.online/api/v1/cities/"),
        ]);

        const categoriesData = await categoriesRes.json();
        const servicesData = await servicesRes.json();
        const citiesData = await citiesRes.json();

        const catMap = {};
        (categoriesData.results || categoriesData).forEach((cat) => {
          catMap[cat.id] = cat.display_name || cat.name;
        });
        setCategoryMap(catMap);

        const servMap = {};
        (servicesData.results || servicesData).forEach((serv) => {
          servMap[serv.id] = serv.display_name || serv.name;
        });
        setServiceMap(servMap);

        const ctyMap = {};
        (citiesData.results || citiesData).forEach((city) => {
          ctyMap[city.id] = city.display_name || city.name;
        });
        setCityMap(ctyMap);
      } catch (error) {
        console.error("Error fetching mappings:", error);
      }
    };
    fetchMappings();
  }, []);

  const fetchProfessionals = useCallback(
    async (loadMore = false) => {
      setLoading(true);
      setError(null);

      if (!loadMore) {
        setProfessionals([]);
      }

      try {
        let url = "https://api.peshekar.online/api/v1/professionals/search";
        const params = new URLSearchParams();

        const currentNextPageUrl = nextPageUrl;

        if (loadMore && currentNextPageUrl) {
          url = currentNextPageUrl;
        } else {
          params.append("page", 1);
        }

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const currentSortOption = sortOptions.find(
          (option) => option.label === selectedSort
        );
        if (currentSortOption) {
          if (currentSortOption.value === "top_rated") {
            params.append("ordering", "-rating");
          } else if (currentSortOption.value === "newest") {
            params.append("ordering", "-created_at");
          }
        }

        if (activeFilters.experienced) {
          params.append("is_experienced", "true");
        }
        if (activeFilters.new) {
          params.append("is_new", "true");
        }
        if (activeFilters.mostViewed) {
          params.append("ordering", "-views");
        }

        if (sidebarFilters.categories.length > 0) {
          sidebarFilters.categories.forEach((id) => {
            params.append("profession_area_id", id);
          });
        }
        if (sidebarFilters.cities.length > 0) {
          sidebarFilters.cities.forEach((id) => {
            params.append("city_id", id);
          });
        }
        if (sidebarFilters.ratings.length > 0) {
          const minRating = Math.min(...sidebarFilters.ratings.map(Number));
          params.append("min_rating", minRating);
        }
        if (sidebarFilters.experience.length > 0) {
          const minYears = Math.min(
            ...sidebarFilters.experience.map((range) =>
              Number(range.split("-")[0])
            )
          );
          params.append("experience_years", minYears);
        }

        const queryString = params.toString();
        let finalUrl = url;
        if (queryString) {
          finalUrl = `${url}?${queryString}`;
        }
        if (loadMore && currentNextPageUrl) {
          finalUrl = currentNextPageUrl;
          if (queryString && !currentNextPageUrl.includes("?")) {
            finalUrl = `${currentNextPageUrl}?${queryString}`;
          } else if (queryString && currentNextPageUrl.includes("?")) {
            const existingParams = new URLSearchParams(
              currentNextPageUrl.split("?")[1]
            );
            const newParamsToAdd = [];
            for (const [key, value] of params.entries()) {
              if (
                !existingParams.has(key) ||
                existingParams.get(key) !== value
              ) {
                newParamsToAdd.push(`${key}=${value}`);
              }
            }
            if (newParamsToAdd.length > 0) {
              finalUrl = `${currentNextPageUrl}&${newParamsToAdd.join("&")}`;
            }
          }
        }

        console.log("Constructed URL:", finalUrl);
        console.log("Query Parameters:", params.toString());
        console.log("Current sidebar filters state:", sidebarFilters);

        const response = await fetch(finalUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const filteredResults = (data.results || []).filter(
          (p) => (p.full_name)
        );

        if (loadMore) {
          setProfessionals((prev) => [...prev, ...filteredResults]);
        } else {
          setProfessionals(filteredResults);
        }
        setNextPageUrl(data.next);
        setTotalProfessionals(data.count || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [selectedSort, activeFilters, searchQuery, sidebarFilters]
  );

  useEffect(() => {
    setPage(1);
    setNextPageUrl(null);
    fetchProfessionals(false);
  }, [
    selectedSort,
    activeFilters,
    searchQuery,
    sidebarFilters,
    fetchProfessionals,
  ]);

  const handleSortSelect = (option) => {
    setSelectedSort(option.label);
    setIsDropdownOpen(false);
  };

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleLoadMore = () => {
    if (nextPageUrl) {
      setPage((prev) => prev + 1);
      fetchProfessionals(true);
    }
  };

  const handleSidebarFilterChange = useCallback((filters) => {
    setSidebarFilters(filters);
  }, []);

    console.log(professionals)
  return (
    <>
    <Header/>
    <section className="ecom-section flex min-h-screen px-11 pt-24 pb-44 gap-19 border-t border-gray-500">
      <div className="ecom-side-bar">
        <NewEcomSideBar onFilterChange={handleSidebarFilterChange} />
      </div>
      <div className="ecom-right flex flex-col flex-1">
        <div className="ecom-right-top mb-14">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-3xl flex items-center gap-5">
              Peşəkarlar
              <span className="text-xl text-[#525B6B] font-semibold">
                axtarış nəticələri ({totalProfessionals})
              </span>
            </h1>
            <div className="relative inline-block text-left"> 
              {/* <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex justify-between items-center gap-1 text-lg w-56 p-4 bg-white border border-gray-300 rounded-lg shadow-sm font-bold hover:bg-gray-50 "
              >
                Sırala: {selectedSort}
                <ArrowUpDown className="w-4 h-4" />
              </button> */}

              <div className="flex justify-end items-center w-full h-full">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative w-56 p-3 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md hover:bg-gray-50 transition-shadow duration-200"
                  style={{ boxShadow: '0 1px 4px 0 rgba(60, 60, 60, 0.08)' }}
                >
                  <div className="flex flex-col items-start pr-8">
                    <p className="text-lg font-bold">Sırala</p>
                  </div>
                  <ArrowUpDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedSort === option.label
                          ? "bg-blue-600 text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* <div className="relative mb-7">
            <input
              type="text"
              placeholder="Peşəkar axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A4862] text-lg pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div> */}
          {/* <div className="flex gap-5 mt-7">
            <button
              onClick={() => toggleFilter("experienced")}
              className={`flex gap-2.5 items-center px-4 py-2 border border-[#1A4862] rounded-3xl transition-colors ${
                activeFilters.experienced
                  ? "bg-[#1A4862] text-white"
                  : "bg-white text-[#1A4862] hover:bg-[#1A4862] hover:text-white"
              }`}
            >
              Təcrübəli <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFilter("new")}
              className={`flex gap-2.5 items-center px-4 py-2 border border-[#1A4862] rounded-3xl transition-colors ${
                activeFilters.new
                  ? "bg-[#1A4862] text-white"
                  : "bg-white text-[#1A4862] hover:bg-[#1A4862] hover:text-white"
              }`}
            >
              Yeni <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFilter("mostViewed")}
              className={`flex gap-2.5 items-center px-4 py-2 border border-[#1A4862] rounded-3xl transition-colors ${
                activeFilters.mostViewed
                  ? "bg-[#1A4862] text-white"
                  : "bg-white text-[#1A4862] hover:bg-[#1A4862] hover:text-white"
              }`}
            >
              Ən çox baxılanlar <Star className="w-4 h-4" />
            </button>
          </div> */}
        </div>
        {/* <div className="flex flex-col items-center justify-center gap-14">
          {loading && professionals.length === 0 ? (
            <div className="text-center text-lg text-gray-600">
              Peşəkarlar yüklənir...
            </div>
          ) : error ? (
            <div className="text-center text-lg text-red-500">
              Xəta: {error}
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center text-lg text-gray-600">
              Heç bir peşəkar tapılmadı.
            </div>
          ) : (
            <div className="flex flex-wrap gap-[27px] justify-center">
              {professionals.map((professional) => (
                <EcomCard
                  key={professional.id}
                  professional={professional}
                  categoryName={categoryMap[professional.profession_area]}
                  specialityName={
                    serviceMap[professional.profession_speciality]
                  }
                  cityNames={
                    professional.cities
                      ? professional.cities
                          .map((cityId) => cityMap[cityId])
                          .filter(Boolean)
                      : []
                  }
                />
              ))}
            </div>
          )}
          {nextPageUrl && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="border border-[#1A4862] transition-all bg-white hover:bg-[#1A4862] py-3 px-16 rounded-lg text-[#1A4862] hover:text-white cursor-pointer"
            >
              {loading ? "Yüklənir..." : "Daha çoxuna bax"}
            </button>
          )}
        </div> */}
          <div className="flex flex-col gap-14">
  {loading && professionals.length === 0 ? (
    <div className="text-center text-lg text-gray-600">
      Peşəkarlar yüklənir...
    </div>
  ) : error ? (
    <div className="text-center text-lg text-red-500">
      Xəta: {error}
    </div>
  ) : professionals.length === 0 ? (
    <div className="text-center text-lg text-gray-600">
      Heç bir peşəkar tapılmadı.
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {professionals.map((professional) => (
        <EcomCard
          key={professional.id}
          professional={professional}
          categoryName={professional.profession_area}
          specialityName={
            serviceMap[professional.profession_speciality]
          }
          cityNames={professional.cities || []}
        />
      ))}
    </div>
  )}
  {nextPageUrl && (
    <div className="flex justify-center">
      <button
        onClick={handleLoadMore}
        disabled={loading}
        className="border border-[#1A4862] transition-all bg-white hover:bg-[#1A4862] py-3 px-16 rounded-lg text-[#1A4862] hover:text-white cursor-pointer"
      >
        {loading ? "Yüklənir..." : "Daha çoxuna bax"}
      </button>
    </div>
  )}
</div>
      </div>
      
    </section>
    <Footer/>
        </>
  );
}