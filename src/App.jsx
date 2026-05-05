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
import PlayerLogin from "./pages/PlayerLogin";
import PendingPlayerUpdates from "./pages/PendingPlayerUpdates";
import EditClubForm from "./pages/EditClubForm";
import SetPassword from "./pages/SetPassword";
import PublicRegistry from "./pages/PublicRegistry";
import MatchSchedule from "./pages/MatchSchedule";
import AdminMatchManager from "./pages/AdminMatchManager";
import ClubProfileEdit from "./pages/ClubProfileEdit";
import PendingClubUpdates from "./pages/PendingClubUpdates";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import PlayerProfileEdit from "./pages/PlayerProfileEdit";
import ClubPlayerUpdates from "./pages/ClubPlayerUpdates";
import ClubDetails from "./pages/ClubDetails";
import PlayerDetails from "./pages/PlayerDetails";
import LoginPage from "./pages/LoginPage";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Helper to protect routes by role
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!token) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to={role === "CLUB" ? `/clubs/${localStorage.getItem("entityId")}` : "/"} />;
    }
    return children;
  };

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
      <Route path="/login-player" element={<PlayerLogin />} />
      <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminDashboard/></ProtectedRoute>}/> 
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminDashboard/></ProtectedRoute>}/> 
      <Route path="/superadmindashboard" element={<ProtectedRoute allowedRoles={["SUPER_ADMIN"]}><SuperAdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/player-updates" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><PendingPlayerUpdates /></ProtectedRoute>} />
      <Route path="/club/set-password" element={<SetPassword />} />
      <Route path="/player/set-password" element={<SetPassword />} />
      <Route path="/registry" element={<PublicRegistry />} />
      <Route path="/matches" element={<MatchSchedule />} />
      <Route path="/admin/matches" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><AdminMatchManager /></ProtectedRoute>} />
      <Route path="/admin/club-updates" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><PendingClubUpdates /></ProtectedRoute>} />
      <Route path="/club/edit-profile" element={<ProtectedRoute allowedRoles={["CLUB"]}><ClubProfileEdit /></ProtectedRoute>} />
      <Route path="/club/player-updates" element={<ProtectedRoute allowedRoles={["CLUB"]}><ClubPlayerUpdates /></ProtectedRoute>} />
      <Route path="/player/edit-profile" element={<ProtectedRoute allowedRoles={["PLAYER"]}><PlayerProfileEdit /></ProtectedRoute>} />
      
      {/* General Detail Views (Authenticated Only) */}
      <Route path="/clubs/:id/view" element={<ProtectedRoute><ClubDetails /></ProtectedRoute>} />
      <Route path="/players/:id/view" element={<ProtectedRoute><PlayerDetails /></ProtectedRoute>} />

      {token ? (
        <>
          <Route path="/create-club" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><CreateClubForm /></ProtectedRoute>} />
          <Route path="/clubs" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><ClubList /></ProtectedRoute>} />
          <Route path="/clubs/edit/:id" element={<ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}><EditClubForm /></ProtectedRoute>} />
          <Route path="/clubs/:id" element={<ProtectedRoute allowedRoles={["CLUB"]}><ClubDashboard /></ProtectedRoute>} />
          <Route path="/players/profile" element={<ProtectedRoute allowedRoles={["PLAYER"]}><PlayerProfile /></ProtectedRoute>} />
        </>
      ) : (
        <Route path="/login" element={<LoginPage />} />
      )}
    </Routes>
  );
}

export default App;
