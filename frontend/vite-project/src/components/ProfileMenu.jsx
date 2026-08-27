import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import API from "../api/api";

function ProfileMenu({ closeMenu }) {
  const { user, setUser } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);

  const changeTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/signout");

      localStorage.removeItem("token");

      setUser(null);
      closeMenu();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  console.log(user);  

  return (
    <div
      className="
        absolute
        right-0
        top-12
        z-[100]
        w-72
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-xl
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      {/* USER INFO */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* Letter */}
          <div
            className="
              flex
              h-10 w-10
              items-center justify-center
              rounded-full
              bg-blue-600
              font-semibold
              text-white
            "
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* Name + email */}
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>

            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* View channel */}
        {/* Create channel if channel does not exist */}
        {/* View channel if channel already exists */}

        {user.channel?._id ? (
          <Link
            to={`/channel/${user.channel._id}`}
            onClick={closeMenu}
            className="
      mt-3
      block
      text-sm
      font-medium
      text-blue-600
      hover:text-blue-700
    "
          >
            View your channel
          </Link>
        ) : (
          <Link
            to="/create-channel"
            onClick={closeMenu}
            className="
      mt-3
      block
      text-sm
      font-medium
      text-blue-600
      hover:text-blue-700
    "
          >
            Create channel
          </Link>
        )}
      </div>

      {/* SIGN OUT */}
      <button
        onClick={handleLogout}
        className="
          w-full
          px-4 py-3
          text-left
          text-sm
          font-medium
          text-gray-800
          hover:bg-gray-100
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        Sign out
      </button>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* APPEARANCE */}
      <button
        onClick={changeTheme}
        className="
          flex
          w-full
          items-center
          justify-between
          px-4 py-3
          text-left
          text-sm
          font-medium
          text-gray-800
          hover:bg-gray-100
          dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        <span>
          Appearance:{" "}
          {theme === "system"
            ? "Device theme"
            : theme === "light"
              ? "Light"
              : "Dark"}
        </span>

        <span className="text-gray-500">›</span>
      </button>
    </div>
  );
}

export default ProfileMenu;
