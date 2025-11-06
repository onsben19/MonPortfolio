import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import PropTypes from 'prop-types';
import "./index.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import Navbar from "./components/Navbar";
import Portofolio from "./Pages/Portofolio";
import ContactPage from "./Pages/Contact";
import ProjectDetails from "./components/ProjectDetail";
import InternshipDetail from "./components/InternshipDetail";
import WelcomeScreen from "./Pages/WelcomeScreen";
import MemojiMessage from "./components/MemojiMessage";
//import ViewCounter from "./components/ViewCounter";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { AnimatePresence } from 'framer-motion';
import NotFoundPage from "./Pages/404";

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

      {!showWelcome && (
        <>
          <Navbar />
          <AnimatedBackground />
          <Home />
          <About />
          <Portofolio />
          <ContactPage />
          <MemojiMessage />
          <AnalyticsTracker />
        </>
      )}
    </>
  );
};

LandingPage.propTypes = {
  showWelcome: PropTypes.bool.isRequired,
  setShowWelcome: PropTypes.func.isRequired,
};

const ProjectPageLayout = () => (
  <>
    <ProjectDetails />
    
  </>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />} />
  <Route path="/project/:id" element={<ProjectPageLayout />} />
  <Route path="/internship/:id" element={<InternshipDetail />} />
         <Route path="*" element={<NotFoundPage />} /> {/* Ini route 404 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;