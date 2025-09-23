import { Routes, Route } from "react-router-dom"

// import your page components
import HomePage from "./Pages/HomePage"
import NftsPage from "./Pages/NftsPage"
import BlogsPage from "./Pages/BlogsPage"
import EventsPage from "./Pages/EventsPage"
import ChatsPage from "./Pages/ChatsPage"
import ProfilePage from "./Pages/ProfilePage"
import Navbar from "./Pages/Navbar"
import PublicProfilePage from "./Pages/PublicProfilePage"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Navbar is outside <Routes>, so it shows on ALL pages */}
      <Navbar/>

      {/* Page content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nfts" element={<NftsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:username" element={<PublicProfilePage />} />
        </Routes>
      </main>
    </div>
  )
}
