import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Playlists from "./pages/Playlists";
import Engagement from "./pages/Engagement";
import { ProfileView } from "./components/profile/ProfileView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/content" element={<Content />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/profile/:userId" element={<ProfileView />} />
      </Routes>
    </Router>
  );
}

export default App;