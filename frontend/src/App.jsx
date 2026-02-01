import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/home';
import ProductDetails from './components/product/ProductDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UploadAvatar from './components/user/UploadAvatar';
import UpdatePassword from './components/user/UpdatePassword';
import Cart from './components/cart/Cart';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route path="/me/profile" element={
            <ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/me/update_profile" element={
            <ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
          <Route path="/me/upload_avatar" element={
            <ProtectedRoute><UploadAvatar/></ProtectedRoute>} />
          <Route path="/me/update_password" element={
            <ProtectedRoute><UpdatePassword/></ProtectedRoute>} />

            <Route path="/cart" element={<Cart/>} />
       
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
 
