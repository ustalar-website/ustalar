import React, { useState } from "react";
import { MdPerson } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import OriginalLogo from "../../public/original-logo.png"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const base =
    "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white";
  const mobileBase =
    "block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700 hover:text-white";

  const navItems = [{ label: "Ana səhifə", to: "/" }];

  return (
    <nav className="bg-white p-2 shadow-sm">
      <div className="mx-auto max-w-7xl ">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="flex w-full items-center justify-between">
            <Link to="/" className="font-semibold text-white text-3xl">
              <img src={OriginalLogo} alt="Logo" className="h-15 w-auto"/>
            </Link>
            <div className="hidden sm:flex items-center space-x-4 p-2 ">
              {navItems.map(({ label, to }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `${base} ${
                      isActive
                        ? "bg-cyan-900 text-white px-3 py-5 text-sm font-semibold border rounded-xl"
                        : "text-white bg-cyan-900 px-6 py-3 text-sm border font-semibold rounded-xl"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 
             bg-white px-4 py-2 rounded-xl text-sm font-semibold text-cyan-800
             hover:bg-gray-100 border "
              >
                <MdPerson className="text-2xl" />
                <span className="font-semibold px-2">Qeydiyyatdan keç</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `${mobileBase} ${
                    isActive ? "bg-cyan-900 text-white" : "text-cyan-900"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full
             rounded-md bg-white px-3 py-2 text-base font-medium text-cyan-800
             hover:bg-gray-100"
            >
              <div className="flex items-center">
                <MdPerson className="text-xl " />
                Qeydiyyatdan keç
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
