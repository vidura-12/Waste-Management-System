import React, { useState, useEffect } from "react";
import { Button, Navbar, Dropdown } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.png";
import avatar from "../images/avatar.png";
import AuthModel from "./AuthModel";
import axios from "axios";
import QRModal from "./QRModal";
import { HiQrcode, HiOutlineLogout, HiChevronDown } from "react-icons/hi";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to track if the dropdown is open, used for chevron rotation
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const cusID = localStorage.getItem("cusID");
  const [customer, setCustomer] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      // Check if cusID exists before fetching
      if (!cusID) return;

      try {
        const res = await axios.get(
          `https://garbage-management-system-server.vercel.app/customer/getCustomer/${cusID}`
        );
        setCustomer(res.data);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [cusID]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.reload();
    }
  };

  const handleOpenQRModal = () => {
    setIsQRModalOpen(true);
  };

  const handleCloseQRModal = () => {
    setIsQRModalOpen(false);
  };

  // Helper function to check if any service-related path is active
  const isServicesActive =
    location.pathname.startsWith("/allSchedules") ||
    location.pathname.startsWith("/wasteSchedule") ||
    location.pathname.startsWith("/wasteLevels");

  return (
    <div className="sticky top-0 z-50">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/90 backdrop-blur-xl border-b border-white/20 shadow-lg" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-200/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute -bottom-20 left-1/4 w-36 h-36 bg-teal-200/30 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <Navbar fluid rounded className="relative bg-transparent">
        <Navbar.Brand as={Link} to="/" className="group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <img
              src={logo}
              className="h-6 sm:h-9 relative z-10 transform group-hover:scale-105 transition-transform"
              alt="Logo"
            />
          </div>
          <span className="self-center whitespace-nowrap text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            Green Bin
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* QR Code Button */}
              <button
                onClick={handleOpenQRModal}
                className="group relative p-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-200/50 hover:border-green-300/70 transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <HiQrcode className="w-6 h-6 text-green-600 relative z-10 transform group-hover:scale-110 transition-transform" />
              </button>

              {/* User Dropdown */}
              <Dropdown
                inline
                label={
                  <div className="flex items-center gap-2 group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-sm opacity-60 group-hover:opacity-80 transition-opacity" />
                      <img
                        src={avatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full relative z-10 border-2 border-white/80 transform group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors hidden sm:block">
                      {customer?.name}
                    </span>
                  </div>
                }
                className="bg-white/95 backdrop-blur-xl border border-green-200/50 rounded-2xl shadow-xl"
              >
                <Dropdown.Item className="hover:bg-green-50/80 transition-colors rounded-lg">
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium cursor-pointer w-full"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    Logout
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </div>
          ) : (
            <Button
              onClick={handleOpenModal}
              className="relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-0"
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity" />
              <span className="relative">Login</span>
            </Button>
          )}
          <Navbar.Toggle className="text-green-600 hover:text-green-700 hover:bg-green-50/50 rounded-xl" />
        </div>

        <Navbar.Collapse className="bg-white/95 backdrop-blur-xl md:bg-transparent rounded-2xl md:rounded-none border border-green-200/50 md:border-0 mt-2 md:mt-0">
          <Navbar.Link
            as={Link}
            to="/"
            className={`group relative py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
              location.pathname === "/"
                ? "text-green-700 bg-green-50/80 px-3"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50/50 px-4"
            }`}
          >
            <div
              className={`absolute -inset-x-3 inset-y-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                location.pathname === "/" ? "opacity-100" : ""
              }`}
            />
            <span className="relative">Home</span>
          </Navbar.Link>

          {isLoggedIn ? (
            /* FIX APPLIED: Dropdown style now matches Navbar.Link style */
            <Dropdown
              label="Services"
              inline={true} // keeps it like other links
              className={`group relative py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
                isServicesActive
                  ? "text-green-700 bg-green-50/80 px-3"
                  : "text-gray-700 hover:text-green-700 hover:bg-green-50/50 px-4"
              }`}
              floatingClass="bg-white/95 backdrop-blur-xl border border-green-200/50 rounded-2xl shadow-xl w-64"
            >
              <Dropdown.Item
                as={Link}
                to="/wasteSchedule"
                className={`p-3 transition-colors rounded-xl text-gray-700 hover:text-green-700 ${
                  location.pathname.startsWith("/wasteSchedule")
                    ? "bg-green-50/80 text-green-700 font-semibold"
                    : "hover:bg-green-50/80"
                }`}
              >
                Schedule Waste Collection
              </Dropdown.Item>

              <Dropdown.Item
                as={Link}
                to="/allSchedules"
                className={`p-3 transition-colors rounded-xl text-gray-700 hover:text-green-700 ${
                  location.pathname.startsWith("/allSchedules")
                    ? "bg-green-50/80 text-green-700 font-semibold"
                    : "hover:bg-green-50/80"
                }`}
              >
                All Schedules
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/wasteLevels"
                className={`p-3 transition-colors rounded-xl text-gray-700 hover:text-green-700 ${
                  location.pathname.startsWith("/wasteLevels")
                    ? "bg-green-50/80 text-green-700 font-semibold"
                    : "hover:bg-green-50/80"
                }`}
              >
                Waste Levels
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <div className="absolute -inset-x-3 inset-y-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              Services (Login Required)
            </div>
          )}
          <Navbar.Link
            as={Link}
            to="/about"
            className={`group relative py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
              location.pathname === "/about"
                ? "text-green-700 bg-green-50/80 px-4" // <-- changed px-3 to px-4
                : "text-gray-700 hover:text-green-700 hover:bg-green-50/50 px-4"
            }`}
          >
            <div
              className={`absolute -inset-x-3 inset-y-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                location.pathname === "/about" ? "opacity-100" : ""
              }`}
            />
            <span className="relative">About</span>
          </Navbar.Link>

          <Navbar.Link
            as={Link}
            to="/contact"
            className={`group relative py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 ${
              location.pathname === "/contact"
                ? "text-green-700 bg-green-50/80 px-4" // <-- changed px-3 to px-4
                : "text-gray-700 hover:text-green-700 hover:bg-green-50/50 px-4"
            }`}
          >
            <div
              className={`absolute -inset-x-3 inset-y-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity ${
                location.pathname === "/contact" ? "opacity-100" : ""
              }`}
            />

            <span className="relative">Contact</span>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      <AuthModel isOpen={isModalOpen} onClose={handleCloseModal} />
      {isQRModalOpen && <QRModal onClose={handleCloseQRModal} />}
    </div>
  );
};

export default Header;
