import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/views/Home/home';
import Dashboard from '@/views/Dashboard/dashboard';
import Clients from '@/views/Clients/clients';
import Plans from '@/views/Plans/plans';
import Tracking from '@/views/Tracking/tracking';
import Schedule from '@/views/Schedule/schedule';
import Documentation from '@/views/Documentation/documentation';
import Layout from './Layout';

function App() {
  useEffect(() => {
    window.Main.removeLoading();
  }, []);

  return (
    <div className="flex flex-col">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
