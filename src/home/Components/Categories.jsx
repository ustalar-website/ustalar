import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './categories.css';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom'
// import table from '../assets/table.svg';
import paint from '../assets/paint.svg';
import bor from '../assets/bor.svg';
import mdi from '../assets/mdi.svg';
// import maki from '../assets/maki.svg';
import sicon from '../assets/sicon.svg';
import kombi from '../assets/kombi.svg';
import baby from '../assets/baby.svg';

import BurgerMenu from './BurgerMenu';

const Categories = () => {
  const [showBurger, setShowBurger] = useState(false);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const categories = [
    { icon: kombi, title: "Kombi ustası", workers: "90+ ", subId: 18 },
    { icon: paint, title: "Rəngsaz", workers: "150+ ", subId: 5 },
    { icon: bor, title: "Santexnik", workers: "400+ ", subId: 3 },
    { icon: mdi, title: "Dülgər", workers: "360+ ", subId: 6 },
    { icon: sicon, title: "Təmizlik xidmətləri", workers: "760+ Usta", subId: 12 },
    { icon: baby, title: "Dayə", workers: "566+ ", subId: 57 }
  ];

  useEffect(() => {
    fetch('/api/v1/services/')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (item) => {
    if (item.categoryId) {
      const filtered = services.filter(
        (service) => service.category.id === item.categoryId
      );
      localStorage.setItem('selectedCategoryServices', JSON.stringify(filtered));
    } else if (item.subId) {
      localStorage.setItem('selectedSubcategory', item.subId);
    }

    localStorage.setItem('shouldExpandCategories', 'true');
    navigate('/ecom');
  };

  return (
    <>
      <section className='categories-section'>
        <div className="categories-header">
          <h2>Kateqoriyalar</h2>
          <div className="view-all" onClick={() => setShowBurger(!showBurger)}>
            <Link to='/ecom' className='view-all'>Daha çox <FiChevronDown className="arrow-icon" /></Link> 
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((item, index) => (
            <div
              className="category-card"
              key={index}
              onClick={() => handleClick(item)}
            >
              <img src={item.icon} alt={item.title} className='category-icon' />
              <div className="category-info">
                <h3>{item.title}</h3>
                <p>{item.workers}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BurgerMenu isOpen={showBurger} onClose={() => setShowBurger(false)} />
    </>
  );
};

export default Categories;
