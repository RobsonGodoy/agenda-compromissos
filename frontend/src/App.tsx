import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { NewAppointment } from './pages/NewAppointment';
import { EditAppointment } from './pages/EditAppointment';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<NewAppointment />} />
        <Route path="/edit/:id" element={<EditAppointment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
