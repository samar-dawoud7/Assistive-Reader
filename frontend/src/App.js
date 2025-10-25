import './App.css';
import './Style/style.css';
import AppRoutes from './AppRoutes';
import { BrowserRouter as Router } from "react-router-dom";
import SideMenu from './Components/sideMenu';
import "bootstrap-icons/font/bootstrap-icons.css";
import TopBar from './Components/TopBar';
import { CaptionProvider } from "./Components/CaptionContext";


function App() {
  return (
    <Router>
      <CaptionProvider>

        <SideMenu />
        <TopBar />
        <AppRoutes />
        
      </CaptionProvider>
    </Router>
  );
}

export default App;
