import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CreateStash } from './components/CreateStash';
import { EditStash } from './components/EditStash';
import { ReportStash } from './components/ReportStash';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateStash />} />
        <Route path="/edit/:slug" element={<EditStash />} />
        <Route path="/report/:slug" element={<ReportStash />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
