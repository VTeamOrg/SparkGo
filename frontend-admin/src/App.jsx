import { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Navbar from './components/Navbar';
import WorkArea from './components/WorkArea';
import MapView from './components/MapView';
import Cookies from 'js-cookie';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);


  console.log('All cookies:', document.cookie);
  
  
  useEffect(() => {
    const loggedInStatus = Cookies.get('userLoggedIn');
    const role = Cookies.get('userRole');
    const id = Cookies.get('userId');

    if (loggedInStatus === 'true') {
      setUserLoggedIn(true);
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  return (
    <div className="App">
      {userLoggedIn ? (
        <div className="app-container">
          <Navbar setActiveSection={setActiveSection} userRole={userRole} />
          <WorkArea activeSection={activeSection} userId={userId} />
          <MapView />
        </div>
      ) : (
        <Login setUserLoggedIn={setUserLoggedIn} setUserRole={setUserRole} setUserId={setUserId} />
      )}
    </div>
  );
}

export default App;