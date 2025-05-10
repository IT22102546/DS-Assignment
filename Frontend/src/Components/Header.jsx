import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HiUser,
  HiMenu,
  HiSearch,
  HiX,
  HiOutlineShoppingCart,
  HiHome,
  HiCollection,
  HiMusicNote,
  HiBookOpen,
  HiUserGroup,
  HiCake,
  HiOutlineTable,
  HiGift,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { signOut } from "../redux/user/userSlice";
import logo from "../assets/Logo.png";
// import logo from "../assets/Logo.jpg";
import { AnimatePresence, motion } from "framer-motion";
import { FaLeaf, FaPhone } from "react-icons/fa";
import { GiCandyCanes } from "react-icons/gi";
import { GiPartyPopper } from "react-icons/gi";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.cartTotalQuantity, 0);
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const encodedSearchTerm = encodeURIComponent(searchTerm.trim());

    try {
      const [cakeRes, sweetRes, natureRes, giftRes] = await Promise.all([
        fetch(`/api/cakes/getcakes?searchTerm=${encodedSearchTerm}`),
        fetch(`/api/sweets/getsweets?searchTerm=${encodedSearchTerm}`),
        fetch(`/api/nature/getnature?searchTerm=${encodedSearchTerm}`),
        fetch(`/api/gift/getgifts?searchTerm=${encodedSearchTerm}`),
      ]);

      if (!cakeRes.ok || !sweetRes.ok || !natureRes.ok || !giftRes.ok) {
        throw new Error("Failed to fetch search results");
      }

      const [cakeData, sweetData, natureData, giftData] = await Promise.all([
        cakeRes.json(),
        sweetRes.json(),
        natureRes.json(),
        giftRes.json(),
      ]);

      if (cakeData.products.length > 0) {
        navigate(`/cakes?search=${encodedSearchTerm}`);
      } else if (sweetData.products.length > 0) {
        navigate(`/sweets?search=${encodedSearchTerm}`);
      } else if (natureData.products.length > 0) {
        navigate(`/nature?search=${encodedSearchTerm}`);
      } else if (giftData.products.length > 0) {
        navigate(`/gift?search=${encodedSearchTerm}`);
      } else {
        alert("No results found for your search.");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-900 text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center mr-4">
            <h1 className="font-semibold text-2xl">OB Cakes</h1>
          </NavLink>
        </div>

        {/* Desktop Search Bar */}
        <div className="relative flex-grow max-w-2xl hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg border bg-white border-gray-300 focus:outline-none  text-black placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <HiSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 mr-3 ml-3">
          {[
            { name: "Home", path: "/", icon: <HiHome size={20} /> },
            { name: "Cakes", path: "/cakes", icon: <HiCake size={20} /> },

            // {
            //   name: "Sweets",
            //   path: "/sweets",
            //   icon: <GiCandyCanes size={20} />,
            // },

            //{ name: "Nature", path: "/nature", icon: <FaLeaf size={20} /> },
            // {
            //   name: "Design",
            //   path: "/design",
            //   icon: <HiOutlineTable size={20} />,
            // },
            {
              name: "AboutUs",
              path: "/aboutus",
              icon: <HiUserGroup size={20} />,
            },
            // {
            //   name: "Booking",
            //   path: "/booking",
            //   icon: <HiBookOpen size={20} />,
            // },
            // { name: "Gift Boxes", path: "/gift", icon: <HiGift size={20} /> },
            // {
            //   name: "Surprise Teams",
            //   path: "/Suprise",
            //   icon: <GiPartyPopper size={20} />,
            // },
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredNav(item.name)}
              onMouseLeave={() => setHoveredNav(null)}
              className="relative flex items-center justify-center p-3 rounded-full text-white bg-gray-800 transition-all duration-300 hover:bg-green-500"
            >
              {hoveredNav === item.name ? (
                <motion.span
                  className="text-sm font-semibold text-white px-4 rounded-full shadow-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  {item.name}
                </motion.span>
              ) : (
                <motion.div initial={{ scale: 1 }} whileHover={{ scale: 1.2 }}>
                  {item.icon}
                </motion.div>
              )}
            </motion.button>
          ))}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <Link to="/cart" className="relative">
                <HiOutlineShoppingCart className="text-gray-300 text-2xl" />
                {getTotalCartItems() > 0 && (
                  <span className="absolute top-[-5px] right-[-4px] translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold rounded-full px-2 py-1">
                    {getTotalCartItems()}
                  </span>
                )}
              </Link>
            )}

            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture}
                    rounded
                    className="h-10 w-10"
                  />
                }
              >
                <DropdownHeader>
                  <span className="block text-sm">{currentUser.username}</span>
                  <span className="block text-sm font-medium truncate">
                    {currentUser.email}
                  </span>
                </DropdownHeader>
                <Link to="/dashboard?tab=profile">
                  <DropdownItem>Profile</DropdownItem>
                </Link>
                <DropdownDivider />
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </Dropdown>
            ) : (
              <Link to="/sign-in">
                <HiUser className="text-gray-800 text-2xl" />
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
          </div>

          {/* Mobile Menu Toggle Button */}
        </div>
        <button
          className="md:hidden ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <HiX className="text-white text-2xl" />
          ) : (
            <HiMenu className="text-white text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 flex flex-col space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none bg-gradient-to-b from-[rgba(254,129,128,0.3)] via-[rgba(255,255,255,0.3)] to-[rgba(254,143,142,0.3)] text-gray-800 placeholder-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <nav className="flex flex-col space-y-2 mt-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "font-semibold text-black" : "font-semibold"
                }
              >
                Home
              </NavLink>

              <Dropdown label="Products" inline>
                <DropdownItem onClick={() => navigate("/cakes")}>
                  Cakes
                </DropdownItem>
              </Dropdown>

              <NavLink
                to="/aboutus"
                className={({ isActive }) =>
                  isActive ? "font-semibold text-black" : "font-semibold"
                }
              >
                About Us
              </NavLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
