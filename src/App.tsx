import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';

const Dashboard = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">Dashboard</div>
);
const Clients = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">Clients</div>
);
const Plans = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">
    Training plans
  </div>
);
const Tracking = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">
    Progress Tracking
  </div>
);
const Schedule = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">Schedule</div>
);
const Settings = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">Settings</div>
);
const Docs = () => (
  <div className="fixed pl-64 inset-0 bg-black text-white flex justify-center items-center text-center">
    Documentation
  </div>
);

function App() {
  useEffect(() => {
    window.Main.removeLoading();
  }, []);

  return (
    <div className="flex flex-col">
      <Router>
        <div className="bg-black h-screen">
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
