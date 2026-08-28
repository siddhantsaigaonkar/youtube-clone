import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  CircleUserRound,
  Menu,
  Bell,
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";
import logo from "../assets/images/youtube-logo.png";

function Header({ toggleSidebar }) {
  // Search input state
  const [search, setSearch] = useState("");

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Used to navigate to search page
  const navigate = useNavigate();

  // Context
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  // Theme
  const changeTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  // Search videos
  const handleSearch = (e) => {
    e.preventDefault();

    // Remove extra spaces
    const searchText = search.trim();

    // Do nothing if search is empty
    if (!searchText) return;

    // Navigate to search page with search query
    navigate(`/search?query=${encodeURIComponent(searchText)}`);

    // Optional: clear search input
    setSearch("");
  };

  return (
    <header
      className="
        sticky top-0 z-50
        flex h-14 w-full items-center gap-2
        overflow-visible
        border-b border-gray-200
        bg-white text-black
        dark:border-gray-800
        dark:bg-gray-950 dark:text-white
        px-2
        sm:h-16 sm:px-4
      "
    >
      {/* LEFT */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          className="
            hidden sm:flex
            h-10 w-10
            items-center justify-center
            rounded-full
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-1">
          <img
            src={logo}
            alt="YouTube logo"
            className="h-7 w-7 object-contain"
          />

          <span className="text-xl font-semibold">YouTube</span>
        </Link>
      </div>

      {/* CENTER - SEARCH */}
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <form
          onSubmit={handleSearch}
          className="
            hidden sm:flex
            h-10
            max-w-2xl
            flex-1
            overflow-hidden
            rounded-full
            border border-gray-300
            dark:border-gray-700
          "
        >
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              min-w-0
              flex-1
              bg-transparent
              px-4
              outline-none
            "
          />

          {/* Search Button */}
          <button
            type="submit"
            className="
              flex
              w-16
              items-center
              justify-center
              border-l
              border-gray-300
              bg-gray-50
              hover:bg-gray-100
              dark:border-gray-700
              dark:bg-gray-800
              dark:hover:bg-gray-700
            "
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        {/* Notifications */}
        <button
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          <Bell size={20} />
        </button>

        {/* PROFILE */}
        {user ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="
                flex
                h-9 w-9
                items-center justify-center
                rounded-full
                bg-blue-600
                text-sm
                font-semibold
                text-white
                hover:ring-2
                hover:ring-gray-300
                sm:h-10 sm:w-10
              "
            >
              {user.name?.charAt(0).toUpperCase()}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <ProfileMenu closeMenu={() => setIsProfileOpen(false)} />
            )}
          </div>
        ) : (
          /* SIGN IN */
          <Link
            to="/login"
            className="
              hidden sm:flex
              items-center gap-2
              rounded-full
              border
              border-gray-300
              px-3 py-2
              text-sm
              font-medium
              text-blue-600
              hover:bg-blue-100
              dark:border-gray-700
              dark:hover:bg-gray-800
            "
          >
            <CircleUserRound size={20} />

            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;