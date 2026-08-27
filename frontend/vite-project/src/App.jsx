import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout";
import Loader from "./components/Loader";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const Auth = lazy(() => import("./pages/Auth"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const LoginPage = lazy(() => import("./pages/Login"));
const SignupPage = lazy(() => import("./pages/Signup"));

const CreateChannel = lazy(() => import("./pages/CreateChannel"));

const ChannelPage = lazy(() => import("./pages/ChannelPage"));
const UploadVideo = lazy(() => import("./pages/UploadVideo"));
const EditVideo = lazy(() => import("./pages/EditVideo"));

// Search Page
const SearchPage = lazy(() => import("./pages/SearchPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={<Loader/>}
      >
        <Routes>
          {/* ================= MAIN APPLICATION ================= */}

          <Route element={<MainLayout />}>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Search */}
            <Route path="/search" element={<SearchPage />} />

            {/* Watch */}
            <Route path="/watch/:id" element={<WatchPage />} />

            {/* Channel Page */}
            <Route path="/channel/:channelId" element={<ChannelPage />} />
          </Route>

          {/* ================= AUTHENTICATION ================= */}

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          <Route path="/auth" element={<Auth />} />

          {/* ================= CHANNEL ================= */}

          {/* Create Channel */}
          <Route path="/create-channel" element={<CreateChannel />} />

          {/* Upload Video */}
          <Route path="/upload" element={<UploadVideo />} />

          {/* Edit Video */}
          <Route path="/edit-video/:id" element={<EditVideo />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
