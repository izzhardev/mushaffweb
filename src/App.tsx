/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConnectivityBanner from './components/ConnectivityBanner';
import DynamicBrandManager from './components/DynamicBrandManager';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Donation from './pages/Donation';
import DonationDetail from './pages/DonationDetail';
import DonationConfirmation from './pages/DonationConfirmation';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import ArticleEditor from './pages/ArticleEditor';
import CampaignEditor from './pages/CampaignEditor';
import ArticleDetail from './pages/ArticleDetail';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <DynamicBrandManager />
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <ConnectivityBanner />
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/donate" element={<DonationDetail />} />
                <Route path="/donate/:id" element={<DonationDetail />} />
                <Route path="/donation-confirmation/:id" element={<DonationConfirmation />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/editor" element={<ArticleEditor />} />
                <Route path="/editor/:id" element={<ArticleEditor />} />
                <Route path="/campaign-editor" element={<CampaignEditor />} />
                <Route path="/campaign-editor/:id" element={<CampaignEditor />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}
