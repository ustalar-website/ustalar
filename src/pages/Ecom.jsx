import React, { useState, useEffect, useCallback } from "react";
import EcomCard from "../components/EcomCard";
import { ArrowUpDown } from "lucide-react";
import Footer from "../home/Components/Footer";
import Header from "../home/Components/Header";
import NewEcomSideBar from "../components/NewEcomSideBar";

const sortOptions = [
  { label: "Sənə ən yaxın", value: "closest" },
  { label: "Ən son yüklənən", value: "newest" },
  { label: "Ən reytinqli", value: "top_rated" },
  { label: "Tövsiyə olunan", value: "recommended" },
];

export default function Ecom() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSort, setSelectedSort] = useState("Ən son yüklənən");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [totalProfessionals, setTotalProfessionals] = useState(0);
  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    subcategories: [],
    cities: [],
  });
  const [categoryMap, setCategoryMap] = useState({});
  const [serviceMap, setServiceMap] = useState({});
  const [cityMap, setCityMap] = useState({});
  const [cityNameMap, setCityNameMap] = useState({});

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
        const ctyNameMap = {};
        (citiesData.results || citiesData).forEach((city) => {
          ctyMap[city.id] = city.display_name || city.name;
          ctyNameMap[city.display_name || city.name] = city.id;
        });
        setCityMap(ctyMap);
        setCityNameMap(ctyNameMap);
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

      let fetchedProfessionals = [];
      let currentNextPageUrl = null;
      let totalCount = 0;

      try {
        if (
          sidebarFilters.subcategories.length > 0 &&
          sidebarFilters.categories.length === 0
        ) {
          const promises = sidebarFilters.subcategories.map(
            async (subcategoryId) => {
              const response = await fetch(
                `https://api.peshekar.online/api/v1/service/${subcategoryId}/professionals/`
              );
              if (!response.ok) {
                throw new Error(
                  `HTTP error! status: ${response.status} for subcategory ${subcategoryId}`
                );
              }
              const data = await response.json();
              return data.results || [];
            }
          );

          const resultsArrays = await Promise.all(promises);
          fetchedProfessionals = resultsArrays.flat();

          const professionalIds = new Set();
          const uniqueProfessionals = [];
          for (const p of fetchedProfessionals) {
            if (!professionalIds.has(p.id)) {
              professionalIds.add(p.id);
              uniqueProfessionals.push(p);
            }
          }
          fetchedProfessionals = uniqueProfessionals;

          let finalProfessionals = fetchedProfessionals;
          if (sidebarFilters.categories.length > 0) {
            finalProfessionals = finalProfessionals.filter((p) => {
              return sidebarFilters.categories.includes(p.profession_area);
            });
          }

          if (sidebarFilters.cities.length > 0) {
            finalProfessionals = finalProfessionals.filter((p) => {
              return (
                p.cities &&
                p.cities.some((cityName) => {
                  const cityId = cityNameMap[cityName];
                  return cityId && sidebarFilters.cities.includes(cityId);
                })
              );
            });
          }

          const currentSortOption = sortOptions.find(
            (option) => option.label === selectedSort
          );
          if (currentSortOption) {
            if (currentSortOption.value === "top_rated") {
              finalProfessionals.sort(
                (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
              );
            } else if (currentSortOption.value === "newest") {
              finalProfessionals.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );
            }
          }

          fetchedProfessionals = finalProfessionals;
          currentNextPageUrl = null;
          totalCount = fetchedProfessionals.length;
        } else {
          const params = new URLSearchParams();
          let baseUrl =
            "https://api.peshekar.online/api/v1/professionals/search";

          if (loadMore && nextPageUrl) {
            baseUrl = nextPageUrl;
          } else {
            params.append("page", 1);
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

          const url = `${baseUrl}${
            params.toString() ? `?${params.toString()}` : ""
          }`;
          console.log("Backend API URL (no subcategories):", url);

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          fetchedProfessionals = data.results || [];
          currentNextPageUrl = data.next;
          totalCount = data.count || 0;
        }

        if (loadMore) {
          setProfessionals((prev) => [...prev, ...fetchedProfessionals]);
        } else {
          setProfessionals(fetchedProfessionals);
        }
        setNextPageUrl(currentNextPageUrl);
        setTotalProfessionals(totalCount);
      } catch (err) {
        setError(err.message);
        setProfessionals([]);
        setTotalProfessionals(0);
        setNextPageUrl(null);
      } finally {
        setLoading(false);
      }
    },
    [selectedSort, sidebarFilters, nextPageUrl, cityNameMap]
  );

  useEffect(() => {
    if (
      Object.keys(categoryMap).length > 0 &&
      Object.keys(serviceMap).length > 0 &&
      Object.keys(cityMap).length > 0 &&
      Object.keys(cityNameMap).length > 0
    ) {
      setPage(1);
      setNextPageUrl(null);
      fetchProfessionals(false);
    }
  }, [
    selectedSort,
    sidebarFilters,
    categoryMap,
    serviceMap,
    cityMap,
    cityNameMap,
  ]);

  const handleSortSelect = (option) => {
    setSelectedSort(option.label);
    setIsDropdownOpen(false);
  };

  const handleLoadMore = () => {
    if (nextPageUrl && sidebarFilters.subcategories.length === 0) {
      setLoading(true);
      setError(null);
      fetch(nextPageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const filteredResults = (data.results || []).filter(
            (p) => p.full_name
          );
          setProfessionals((prev) => [...prev, ...filteredResults]);
          setNextPageUrl(data.next);
          setTotalProfessionals(
            (prevTotal) => prevTotal + filteredResults.length
          );
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else if (
      sidebarFilters.subcategories.length > 0 &&
      sidebarFilters.categories.length === 0
    ) {
      console.warn(
        "Pagination is not supported when multiple subcategories are selected (frontend OR logic)."
      );
    }
  };

  const handleSidebarFilterChange = useCallback((filters) => {
    setSidebarFilters({
      categories: filters.categories,
      subcategories: filters.subcategories,
      cities: filters.cities,
    });
  }, []);

  console.log("Current professionals state:", professionals);
  console.log("Current cityMap state:", cityMap);
  console.log("Current cityNameMap state:", cityNameMap);

  return (
    <>
      <Header />
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
                <div className="flex justify-end items-center w-full h-full">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative w-56 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-start pr-8">
                      <p className="text-lg font-light">{selectedSort}</p>
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
          </div>
          <div className="flex flex-col gap-14">
            {loading && professionals.length === 0 ? (
              <div className="text-center text-lg text-gray-600">
                Peşəkarlar yüklənir...
              </div>
            ) : error ? (
              <div className="text-center text-lg text-gray-600">
                Heç bir peşəkar tapılmadı.
              </div>
            ) : professionals.length === 0 ? (
              <div className="text-center text-lg text-gray-600">
                Heç bir peşəkar tapılmadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {professionals.map((professional) => {
                  const rawCities = professional.cities;
                  const mappedCityNames = rawCities
                    ? rawCities
                        .map((cityNameFromAPI) => {
                          const cityId = cityNameMap[cityNameFromAPI];
                          const actualCityName = cityMap[cityId];

                          if (!actualCityName) {
                            console.warn(
                              `Professional ID: ${professional.id} - API-dən gələn şəhər adı '${cityNameFromAPI}' cityMap-də (və ya cityNameMap-də) tapılmadı. ` +
                                `API-dən gələn xam şəhərlər:`,
                              rawCities,
                              `Cari cityMap açarları:`,
                              Object.keys(cityMap),
                              `Cari cityNameMap açarları:`,
                              Object.keys(cityNameMap)
                            );
                          }
                          return actualCityName;
                        })
                        .filter(Boolean)
                    : [];

                  return (
                    <EcomCard
                      key={professional.id}
                      professional={professional}
                      categoryName={categoryMap[professional.profession_area]}
                      specialityName={
                        serviceMap[professional.profession_speciality]
                      }
                      cityNames={mappedCityNames}
                    />
                  );
                })}
              </div>
            )}
            {nextPageUrl && sidebarFilters.subcategories.length === 0 && (
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
      <Footer />
    </>
  );
}
