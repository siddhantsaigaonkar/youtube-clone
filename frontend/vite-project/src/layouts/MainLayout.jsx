import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Current sidebar drag position
  const [dragX, setDragX] = useState(0);

  // Are we currently dragging?
  const [isDragging, setIsDragging] = useState(false);

  // Starting X position of finger
  const touchStartX = useRef(0);

  // Sidebar width
  const SIDEBAR_WIDTH = 240;

  const toggleSidebar = () => {
    setIsSidebarOpen((current) => !current);
    setDragX(0);
  };

  // -----------------------------
  // Touch Start
  // -----------------------------
  const handleTouchStart = (e) => {
    // Mobile only
    if (window.innerWidth >= 768) return;

    if (!isSidebarOpen) return;

    touchStartX.current = e.touches[0].clientX;

    setIsDragging(true);
  };

  // -----------------------------
  // Touch Move
  // -----------------------------
  const handleTouchMove = (e) => {
    // Mobile only
    if (window.innerWidth >= 768) return;

    if (!isDragging || !isSidebarOpen) return;

    const currentX = e.touches[0].clientX;

    const distance = currentX - touchStartX.current;

    // Only allow dragging to the LEFT
    if (distance <= 0) {
      // Don't allow sidebar to move beyond its width
      const limitedDistance = Math.max(distance, -SIDEBAR_WIDTH);

      setDragX(limitedDistance);
    }
  };

  // -----------------------------
  // Touch End
  // -----------------------------
  const handleTouchEnd = () => {
    // Mobile only
    if (window.innerWidth >= 768) return;

    if (!isDragging) return;

    setIsDragging(false);

    /*
      Sidebar width = 240px

      If user dragged more than half:
      close sidebar

      Otherwise:
      keep sidebar open
    */

    if (Math.abs(dragX) > SIDEBAR_WIDTH / 2) {
      setIsSidebarOpen(false);
    }

    // Reset drag position.
    // CSS transition will animate it.
    setDragX(0);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white">
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        dragX={dragX}
        isDragging={isDragging}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
        sidebarWidth={SIDEBAR_WIDTH}
        closeSidebar={() => {
          setIsSidebarOpen(false);
          setDragX(0);
        }}
      />

      {/* Main Content */}
      <main
        className={`
          min-h-[calc(100vh-3.5rem)]
          pb-16
          sm:min-h-[calc(100vh-4rem)]
          md:pb-0
          transition-all duration-300
          ${isSidebarOpen ? "md:ml-60" : "md:ml-0"}
        `}
      >
        <Outlet context={{ toggleSidebar }} />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default MainLayout;
