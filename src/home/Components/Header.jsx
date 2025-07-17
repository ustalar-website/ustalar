import React, { useState, useEffect } from "react";
import "./header.css";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiChevronDown,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
// import Logo from "../../../public/original-logo.png";
import Logo from "../../../public/headersvg.png";
import BurgerMenuOverlay from "./BurgerMenu";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  // Define your categories here or import them
  const categories = [
    { title: "Kombi ustası", subId: 18 },
    { title: "Rəngsaz", subId: 5 },
    { title: "Santexnik", subId: 3 },
    { title: "Dülgər", subId: 6 },
    { title: "Təmizlik xidmətləri", subId: 12 },
    { title: "Dayə", subId: 57 },
    { title: "Elektrik", subId: 2 },
    { title: "Suvaqçı", subId: 7 },
    { title: "Plitəçi və kafel-plitə", subId: 8 },
    { title: "Malyar", subId: 10 },
    { title: "Paltaryuyan / Qabyuyan ustası", subId: 13 },
    { title: "Soyuducu ustası", subId: 14 },
    { title: "Kondisioner ustası", subId: 15 },
    { title: "Televizor ustası", subId: 16 },
    { title: "Kiçik məişət əşyaları ustası", subId: 17 },
    { title: "Telefon və kompüter ustası", subId: 19 },
    { title: "Kanalizasiya xidmətləri", subId: 20 },
    { title: "Ev heyvanlarına qulluq", subId: 21 },
    { title: "Pərdə və jalüz quraşdırılması", subId: 22 },
    { title: "Bərbər / Saç ustası", subId: 42 },
    { title: "Vizajist / Makyaj ustası", subId: 43 },
    { title: "Dəri baxımı / Kosmetoloq", subId: 44 },
    { title: "Masajist", subId: 45 },
    { title: "Manikür / Pedikür", subId: 46 },
    { title: "Fizioterapevt / Reabilitasiya", subId: 47 },
    { title: "Tibb bacısı", subId: 49 },
    { title: "Psixoloq", subId: 51 },
    { title: "Fitnes məşqçisi", subId: 52 },
    { title: "Dietoloq / Qidalanma mütəxəssisi", subId: 53 },
    { title: "Uşaq inkişafı üzrə mütəxəssis", subId: 54 },
    { title: "Loqoped", subId: 55 },
    { title: "Ev xidmətçisi / Xadimə", subId: 58 }
];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://api.peshekar.online/api/v1/cities/"
        );
        if (!response.ok) throw new Error("Şəhərlər yüklənə bilmədi");

        const data = await response.json();
        setCities(data);
        if (data.length > 0) setSelectedCity(data[0].id.toString());
        setError(null);
      } catch (err) {
        setError(err.message);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matchedCategories = categories.filter(category =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSuggestions(matchedCategories);
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") return;

    const matchedCategory = categories.find(category =>
      category.title.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchedCategory) {
      localStorage.setItem('selectedSubcategory', matchedCategory.subId);
      localStorage.setItem('shouldExpandCategories', 'true');
      navigate('/ecom');
    } else {
      navigate('/ecom', { state: { searchQuery: searchTerm } });
    }

    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (category) => {
    setSearchTerm(category.title);
    setShowSuggestions(false);
    localStorage.setItem('selectedSubcategory', category.subId);
    localStorage.setItem('shouldExpandCategories', 'true');
    navigate('/ecom');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container fixed-header">
      <div className="header-left">
        <div className="logo">
          <Link to='/'>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <button className="menu-button" onClick={toggleMenu}>
          {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      <div className="header-middle">
        <div className="search-area">
          <div className="search-input-wrapper">
            <FiSearch size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Axtar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {searchTerm && (
              <button
                className="clear-button"
                onClick={() => setSearchTerm("")}
                aria-label="Axtarışı sil"
              >
                <FiX size={16} />
              </button>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((category, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(category)}
                  >
                    {category.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="city-selector-wrapper">
            {isLoadingCities ? (
              <select disabled className="select">
                <option>Yüklənir...</option>
              </select>
            ) : error ? (
              <select disabled className="select">
                <option>{error}</option>
              </select>
            ) : (
              <select
                className="select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="" disabled>
                  Şəhər seçin
                </option>
                {cities.map((city) => (
                  <option
                    className="option_select"
                    key={city.id}
                    value={city.id.toString()}
                  >
                    {city.display_name}
                  </option>
                ))}
              </select>
            )}
            <FiChevronDown size={16} className="dropdown-icon" />
          </div>
        </div>

        <button className="search-button-primary" onClick={handleSearch}>
          Axtar
        </button>
      </div>

      <div className="header-right">
        {isAuthenticated ? (
          <>
            <Link to="/profil" className="register-button profile-button">
              <FaRegUserCircle size={18} />
              <span>{user?.first_name || "Profil"}</span>
            </Link>
            <button
              className="register-button logout-button"
              onClick={() => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userData");
                setIsAuthenticated(false);
                setUser(null);
                navigate("/login");
              }}
            >
              <FiLogOut size={16} />
              <span>Çıxış</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="register-button login-button">
              Daxil Ol
            </Link>
            <Link to="/register" className="register-button">
              <FiUser size={16} />
              <span>Qeydiyyat</span>
            </Link>
          </>
        )}
      </div>

      <BurgerMenuOverlay isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
}

export default Header;