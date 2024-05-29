import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EventList from './views/EventList';
import EventMod from './views/EventMod';

// EventFormState를 정의합니다.
interface EventFormState {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/event/list" element={<EventList />} />
        <Route path="/event/mod/:id" element={<EventMod />} />
        <Route path="/event/add" element={<EventMod />} />
      </Routes>
    </Router>
  );
}

export default App;
