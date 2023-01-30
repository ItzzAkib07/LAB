import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Admin from './Admin';
import Main from './Main';


function App() {
  return (
  
    <Router>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/home" element={<Home/>}/>
          <Route exact path="/admin" element={<Admin/>}/>
          <Route exact path="/main" element={<Main/>}/>
        </Routes>
    </Router>

  );
}

export default App;
