import { LogOut, ShoppingCart } from 'lucide-react';

const Navbar = ({ onLogout, cartCount = 0 }) => {
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await onLogout();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold"> E-Commerce Shop</h1>
          <p className="text-xs text-blue-100">Shop Smart, Live Better</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-blue-700 px-3 py-2 rounded-lg flex items-center">
            <ShoppingCart size={20} className="mr-2" />
            <span className="text-sm">Cart: <span className="font-bold">{cartCount}</span></span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 font-semibold"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;