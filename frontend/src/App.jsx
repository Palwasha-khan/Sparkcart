import { BrowserRouter as Router, Routes, } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminRoutes from './components/routes/adminRoutes';
import UserRoutes from './components/routes/userRoutes';   


function App() {
  const userRoutes = UserRoutes();
  const adminRoutes = AdminRoutes();
  return (
    <Router>
      <Toaster position="top-center" />
      <Header />
      <div className="container">
        <Routes>
           {userRoutes} 
            {adminRoutes}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
 
