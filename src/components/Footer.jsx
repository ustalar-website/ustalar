import { Link } from "react-router-dom"
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { IoLocationOutline, IoCallOutline, IoMailOutline } from "react-icons/io5"
import React from "react"

const Footer = () => {
  return (
    <footer className="bg-[#1A4862] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold"></h2>
            <p className="text-gray-300 max-w-sm leading-relaxed">
              Azərbaycanda peşəkar ustaları müştərilərlə birləşdirən platforma
            </p>
            <div className="flex space-x-4">
              <Link
                to="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-white text-lg" />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <FaXTwitter className="text-white text-lg" />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-white text-lg" />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-white text-lg" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Əlaqə</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <IoLocationOutline className="text-xl text-gray-300 flex-shrink-0" />
                <span className="text-gray-300">Bakı, Azərbaycan</span>
              </div>
              <div className="flex items-center space-x-3">
                <IoCallOutline className="text-xl text-gray-300 flex-shrink-0" />
                <Link to="tel:+994555555555" className="text-gray-300 hover:text-white transition-colors">
                  +994 55 555 55 55
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <IoMailOutline className="text-xl text-gray-300 flex-shrink-0" />
                <Link to="mailto:info@paputi.az" className="text-gray-300 hover:text-white transition-colors">
                  info@paputi.az
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-gray-300 text-sm">©2025 Paputi. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  )
}


export default Footer
