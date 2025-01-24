import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Playlists from "./pages/Playlists";
import Engagement from "./pages/Engagement";
import { ProfileView } from "./components/profile/ProfileView";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content" element={<Content />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/profile/:userId" element={<ProfileView />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;