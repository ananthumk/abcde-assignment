import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ItemList from './components/ItemList';
import Navbar from './components/Navbar';

function App() {
  const { loggedIn, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {!loggedIn ? (
        <Login />
      ) : (
        <>
          <Navbar onLogout={logout} />
          <ItemList />
        </>
      )}
    </div>
  );
}

export default App;