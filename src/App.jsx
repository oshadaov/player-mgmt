import { Routes, Route, Navigate } from "react-router-dom";
import PlayerForm from "./pages/PlayerForm";
import PlayerList from "./pages/PlayerList";
import PlayerProfile from "./pages/PlayerProfile";
import EditPlayerPage from "./pages/EditPlayer";
import AdminDashboard from "./pages/AdminDashboard";
import PlayerListByClub from "./pages/PlayerListByClub";
import CreateClubForm from "./pages/CreateClubForm";
import ClubList from "./pages/ClubList";
import ClubLogin from "./pages/ClubLogin";
import LandingPage from "./pages/LandingPage";
import ClubDashboard from "./pages/ClubDashboard";
function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* <Route path="/" element={<AdminDashboard/>}/> */}
      <Route path="/players" element={<PlayerList />} />
      <Route path="/players/:id" element={<PlayerProfile />} />
      <Route path="players/edit/:id" element={<EditPlayerPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/players/register-player" element={<PlayerForm />} />
      <Route path="/players/:clubId" element={<PlayerListByClub />} />
      <Route path="/clublogin" element={<ClubLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard/>}/> 
      {token ? (
        <>
          <Route path="/create-club" element={<CreateClubForm />} />
          <Route path="/clubs" element={<ClubList />} />
          <Route path="/clubs/:id" element={<ClubDashboard />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/clubs" />} />
      )}
    </Routes>
  );
}

export default App;
