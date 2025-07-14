import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './footer.css';

const Footer = () => {
  const openBurgerAndCategory = (categoryId) => {
   
    const dahaCoxBtn = document.querySelector('.view-all');
    if (dahaCoxBtn) dahaCoxBtn.click();

  
    setTimeout(() => {
      const allButtons = document.querySelectorAll('.category-button');
      allButtons.forEach((btn) => {
        const text = btn.innerText.trim();
        if (text.includes(categoryId)) {
          btn.click();
        }
      });
    }, 300); 
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">

          <div className="footer-column footer-about">
            <div className="footer-brand">
              <h3 className="footer-title">Peşəkar.online</h3>
              <div className="title-underline"></div>
            </div>
            <p className="footer-description">
              Azərbaycanda peşəkar ustaları müştərilərlə birləşdirən platforma
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook" className="social-link"><FaFacebook className="social-icon" /></a>
              <a href="#" aria-label="Twitter" className="social-link"><FaTwitter className="social-icon" /></a>
              <a href="#" aria-label="Instagram" className="social-link"><FaInstagram className="social-icon" /></a>
              <a href="#" aria-label="LinkedIn" className="social-link"><FaLinkedin className="social-icon" /></a>
            </div>
          </div>

          <div className="footer-column footer-links">
            <h3 className="footer-title">Sürətli Keçidlər</h3>
            <ul className="footer-nav">
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('Təmir və tikinti')}>Təmir və tikinti</button></li>
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('Ev və məişət xidmətləri')}>Ev və məişət xidmətləri</button></li>
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('Təhsil xidmətləri')}>Təhsil xidmətləri</button></li>
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('Gözəllik və sağlamlıq')}>Gözəllik və sağlamlıq</button></li>
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('Ailə və Baxıcı xidmətləri')}>Ailə və Baxıcı xidmətləri</button></li>
              <li><button className="footer-link" onClick={() => openBurgerAndCategory('İctimai və fərdi təlimlər')}>İctimai və fərdi təlimlər</button></li>
            </ul>
          </div>

          <div className="footer-column footer-contact">
            <h3 className="footer-title">Əlaqə</h3>
            <ul className="contact-list">
              <li className="contact-item"><FiMapPin className="contact-icon" /><span>Bakı, Azərbaycan</span></li>
              <li className="contact-item"><FiPhone className="contact-icon" /><span>+994 55 555 55 55</span></li>
              <li className="contact-item"><FiMail className="contact-icon" /><span>info@peshekar.online</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">&copy; {new Date().getFullYear()} Peşəkar. Bütün hüquqlar qorunur.</p>
            <div className="legal-links">
              <a href="#" className="legal-link">Qaydalar</a>
              <a href="#" className="legal-link">Məxfilik Siyasəti</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
