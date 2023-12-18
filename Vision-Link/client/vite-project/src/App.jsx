import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MeetRoom from './pages/MeetRoom.jsx'
import { Route, Routes } from 'react-router-dom';
// import RouteProtecter from './protectedRoute/RouteProtecter';
// import LoginProtector from './protectedRoute/LoginProtector';
import Profile from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {


  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={  <Home /> } />
        <Route path = '/login' element={ <Login />   } />
        <Route path='/register' element={ <Register /> } />
        <Route path="/meet/:id" element={  <MeetRoom />} />
        <Route path="/profile" element={  <Profile /> } />
      
      </Routes>
      
    </div>
  );
}

export default App;