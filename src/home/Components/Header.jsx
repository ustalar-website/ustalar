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
import Logo from  '../../../public/logo_original.png';
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

  const navigate = useNavigate();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header-container fixed-header">
      <div className="header-left">
        <Link className="logo" to="/">
          <img src={Logo} alt="Logo" />
        </Link>
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
          </div>

          <div className="city-selector-wrapper">
            {isLoadingCities ? (
              <select disabled class="select">
                <option>Yüklənir...</option>
              </select>
            ) : error ? (
              <select disabled class="select">
                <option>{error}</option>
              </select>
            ) : (
              <select
                class="select"
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

        <button className="search-button-primary">Axtar</button>
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
