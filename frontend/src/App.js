import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import ResultPage from './pages/ResultPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen flex flex-col gradient-bg">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<GeneratePage />} />
                <Route path="/result/:projectId" element={<ResultPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;