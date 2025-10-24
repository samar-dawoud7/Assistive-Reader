import './App.css';
import './Style/style.css';
import AppRoutes from './AppRoutes';
import { BrowserRouter as Router } from "react-router-dom";
import SideMenu from './Components/sideMenu';
import "bootstrap-icons/font/bootstrap-icons.css";
import TopBar from './Components/TopBar';

function App() {
  return (
    <Router>
      <SideMenu />
      <TopBar />

      <AppRoutes />

    </Router>
  );
}

export default App;
