import './App.css';
import './Style/style.css';
import AppRoutes from './AppRoutes';
import { BrowserRouter as Router } from "react-router-dom";
import SideMenu from './Components/sideMenu';
import "bootstrap-icons/font/bootstrap-icons.css";
import TopBar from './Components/TopBar';
import { CaptionProvider } from "./Components/CaptionContext";
import { SpeechProvider } from "./Hooks/SpeechContext";

function App() {
  return (
    <Router>
      
      <CaptionProvider>
        <SpeechProvider>

        <SideMenu />
        <TopBar />
        <AppRoutes />
        </SpeechProvider>
        
      </CaptionProvider>
    </Router>
  );
}

export default App;
