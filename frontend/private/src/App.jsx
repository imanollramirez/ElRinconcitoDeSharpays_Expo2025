import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import Employee from "./pages/Employee.jsx";
import RecoveryPassword from "./pages/RecoveryPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Orders from "./pages/Orders.jsx";
import Sharpays from "./pages/SharpaysBoutique.jsx";
import FrostyBites from "./pages/FrostyBites.jsx";
import Bougies from "./pages/Bougies.jsx";
import Paraiso from "./pages/Paraiso.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Category from "./pages/Category.jsx";
import SideBar from "./components/Sidebar.jsx";
import Footer from "./components/Footer.jsx";
import Events from "./pages/Events.jsx";
import Profile from "./pages/Profile.jsx";

import NotFound from "./pages/NotFound.jsx";
import LoadingAnimation from "./components/LoadingAnimation.jsx";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  function SideBarSelector() {
    const { pathname } = useLocation();
    const noNavbarPaths = ["/login", "/Register", "/RecoveryPassword", "/NotFound"]

    if (noNavbarPaths.includes(pathname)) return null
    else
    return <SideBar/>;
  }

  function FooterSelector() {
    const { pathname } = useLocation();
    const footerPaths = ["/login", "/Register", "/RecoveryPassword"];

    if (footerPaths.includes(pathname)) return <Footer />;
    return null;
  }

  return (
    <Router>
      <AuthProvider>
        <SideBarSelector />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/RecoveryPassword" element={<RecoveryPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/NotFound" element={<NotFound/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Employee" element={<Employee />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Sharpays" element={<Sharpays />} />

            <Route path="/Category" element={<Category />} />

            <Route path="/bougies" element={<Bougies />} />
            <Route path="/frostybites" element={<FrostyBites />} />
            <Route path="/paradise" element={<Paraiso />} />
            <Route path="/Events" element={<Events />} />
          </Route>
            <Route path="*" element={<LoadingAnimation navTo="/NotFound" replace />} />
        </Routes>
        <FooterSelector />
      </AuthProvider>
    </Router>
  );
}

export default App;
