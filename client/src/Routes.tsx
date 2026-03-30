import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter import
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Heatmap from "./pages/Heatmap";
import Alerts from "./pages/Alerts";
import Insights from "./pages/Insights";
import MapPage from "./pages/MapPage";
import Operations from "./pages/Operations";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AddFarmer from "./pages/AddFarmer";
import FarmersPage from "./pages/FarmersPage";
const AppRoutes: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/insights" element={<Insights />} />
        {/*<Route path="/profile" element={<Profile />} />*/}
        <Route path="/map" element={<MapPage />} />
        <Route path="/ops" element={<Operations />} />
        <Route path = "/login" element = {<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path="/farmers" element={<FarmersPage />} />
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;

