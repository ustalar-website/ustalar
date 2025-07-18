import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './burger.css';
import { FiChevronDown } from 'react-icons/fi';

import temir from '../assets/temir.svg';
import ev from '../assets/ev.svg';
import tehsil from '../assets/tehsil.svg';
import gozelik from '../assets/gozellik.svg';
import aile from '../assets/aile.svg';
import ictimai from '../assets/ictimai.svg';

const BurgerMenu = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const categoriesData = [
    { id: 2, name: 'Təmir və tikinti', icon: temir },
    { id: 3, name: 'Ev və məişət xidmətləri', icon: ev },
    { id: 4, name: 'Təhsil xidmətləri', icon: tehsil },
    { id: 5, name: 'Gözəllik və sağlamlıq', icon: gozelik },
    { id: 6, name: 'Ailə və Baxıcı xidmətləri', icon: aile },
    { id: 7, name: 'İctimai və fərdi təlimlər', icon: ictimai },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.peshekar.online/api/v1/services/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const goToEcom = () => {
    if (location.pathname === '/ecom') {
      // If already on /ecom, force refresh so new filters are applied
      window.location.reload();
    } else {
      navigate('/ecom');
    }
  };

  const handleCategoryClick = (categoryId) => {
    localStorage.setItem('selectedCategory', categoryId);
    localStorage.removeItem('selectedSubcategory');
    localStorage.setItem('shouldExpandCategories', 'true');
    goToEcom();
    onClose();
  };

  const handleSubcategoryClick = (subcategoryId) => {
    localStorage.setItem('selectedSubcategory', subcategoryId);
    localStorage.setItem('shouldExpandCategories', 'true');
    goToEcom();
    onClose();
  };

  const toggleCategory = (id, e) => {
    e.stopPropagation();
    setActiveCategory(activeCategory === id ? null : id);
  };

  const getSubcategories = (categoryId) => {
    return services
      .filter((service) => service.category?.id === categoryId)
      .map((service) => ({
        id: service.id,
        name: service.display_name,
      }));
  };

  return (
    <div className={`burger-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="burger-overlay" onClick={onClose} />

      <div className="burger-menu">
        <nav className="burger-nav">
          <ul className="category-list">
            {categoriesData.map((category) => (
              <li
                key={category.id}
                className="category-item"
                onClick={() => handleCategoryClick(category.id)}
              >
                <button
                  className="category-button"
                  onClick={(e) => toggleCategory(category.id, e)}
                  aria-expanded={activeCategory === category.id}
                >
                  <div className="category-content">
                    <img src={category.icon} alt="" className="category-icon" />
                    <span className="category-text">{category.name}</span>
                  </div>
                  <FiChevronDown
                    className={`arrow ${activeCategory === category.id ? 'open' : ''}`}
                  />
                </button>

                {activeCategory === category.id && (
                  <ul className="subcategory-list">
                    {loading ? (
                      <li className="subcategory-item">Loading...</li>
                    ) : error ? (
                      <li className="subcategory-item">Error loading services</li>
                    ) : (
                      getSubcategories(category.id).map((sub) => (
                        <li
                          key={sub.id}
                          className="subcategory-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryClick(sub.id);
                          }}
                        >
                          <span className="subcategory-link">{sub.name}</span>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BurgerMenu;
