// src/App.tsx

import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from "react-router-dom";
import CitiesTable from './components/CitiesTable';
import WeatherDisplay from './components/WeatherDisplay';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<CitiesTable />} />
          <Route path='/weather/:cityname/:country' element={<WeatherDisplay />} />
        </Routes>
      </BrowserRouter>

    </>
  );
};

export default App;


