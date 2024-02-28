

// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FrontPage from './components/FrontPage.js';
import SearchNewJobs from './components/SearchNewJob.js';
import SavedJobs from './components/SavedJobs.js';
import PrivateRoute from './components/PrivateRoute.js';
import NewLogin from './components/NewLogin.js';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewLogin/>} />
        <Route path="/front-page" element={<FrontPage />} />
        <Route path="/search" element={<PrivateRoute><SearchNewJobs /></PrivateRoute>} />
        <Route path="/saved-jobs" element={<PrivateRoute><SavedJobs /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


