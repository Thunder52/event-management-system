import { useState } from 'react';
import CreateEvent from './components/createEvent/CreateEvent';
import Navbar from './components/navbar/Navbar';
import Event from './components/eventPage/Event';
import './App.css';

function App() {
  return (
    <>
      <Navbar />

      <div className="page">
        <div className="flex-container">
          <CreateEvent />
          <Event />
        </div>
      </div>
    </>
  );
}

export default App;