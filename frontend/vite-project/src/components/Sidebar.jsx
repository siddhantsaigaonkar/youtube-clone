import {
  Home,
  PlaySquare,
  History,
  ThumbsUp,
  UserRound,
  Clock3,
  Flame,
  ListVideo,
} from "lucide-react";

import Subscriptions from "./Subscriptions";

function Sidebar({
  isOpen,
  dragX,
  isDragging,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  sidebarWidth,
  closeSidebar,
}) {
  const sidebarTransform = isOpen
    ? `translateX(${dragX}px)`
    : `translateX(-100%)`;

  return (
    <>
      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {isOpen && (
        <div
          className={`
            fixed
            inset-0
            z-30
            bg-black/40
            md:hidden
            ${isDragging ? "" : "transition-opacity duration-300"}
          `}
          style={{
            opacity: 1 - Math.abs(dragX) / sidebarWidth,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={closeSidebar}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`
          fixed
          left-0
          top-14
          z-40

          h-[calc(100vh-3.5rem)]
          w-60

          overflow-y-auto

          border-r
          border-gray-200

          bg-white
          px-3
          py-4
          text-black

          dark:border-gray-800
          dark:bg-gray-950
          dark:text-white

          sm:top-16
          sm:h-[calc(100vh-4rem)]

          ${isDragging ? "" : "transition-transform duration-300 ease-out"}
        `}
        style={{
          transform: sidebarTransform,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* =========================
            MAIN MENU
        ========================= */}

        <div className="space-y-1">
          <SidebarItem icon={<Home size={21} />} label="Home" />

          <SidebarItem icon={<Flame size={21} />} label="Trending" />
        </div>

        {/* =========================
            SUBSCRIPTIONS
        ========================= */}

        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex">
            <SidebarItem icon={<PlaySquare size={21} />} label="Subscription" />
          
          </div>

          <Subscriptions />
        </div>

        {/* =========================
            SHOW MORE
            Actually handled inside
            Subscriptions component
        ========================= */}

        {/* =========================
            YOU
        ========================= */}

        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
          <h2 className="px-3 pb-2 text-sm font-semibold">You</h2>

          <div className="space-y-1">
            <SidebarItem icon={<UserRound size={21} />} label="Your channel" />

            <SidebarItem icon={<History size={21} />} label="History" />

            <SidebarItem icon={<ListVideo size={21} />} label="Playlists" />

            <SidebarItem icon={<Clock3 size={21} />} label="Watch later" />

            <SidebarItem icon={<ThumbsUp size={21} />} label="Liked videos" />
          </div>
        </div>
      </aside>
    </>
  );
}

/* =========================
   SIDEBAR ITEM
========================= */

function SidebarItem({ icon, label }) {
  return (
    <button
      className="
        flex
        w-full
        items-center
        gap-4

        rounded-lg

        px-3
        py-2.5

        text-left
        text-sm
        font-medium

        text-gray-800

        hover:bg-gray-100

        dark:text-gray-200
        dark:hover:bg-gray-800
      "
    >
      {icon}

      <span className="truncate">{label}</span>
    </button>
  );
}

export default Sidebar;
