import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/views/Dashboard/dashboard';
import Clients from '@/views/Clients/clients';
import Plans from '@/views/Plans/plans';
import Schedule from '@/views/Schedule/schedule';
import Documentation from '@/views/Documentation/documentation';
import Layout from './Layout';

function App() {
  useEffect(() => {
    window.Main.removeLoading();
  }, []);

  return (
    <div className="pl-content">
      <div className="w-full h-full relative">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/docs" element={<Documentation />} />
            </Routes>
          </Layout>
        </Router>
      </div>
    </div>
  );
}

export default App;
