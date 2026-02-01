import { useSelector } from "react-redux";
import { useGetMeQuery } from "../../redux/api/userApi"
import { useLogoutMutation } from "../../redux/api/authApi";
import { useNavigate } from "react-router-dom";

import Search from "./Search"
import { Link } from "react-router-dom";

function Header() {
 const { isLoading } = useGetMeQuery(undefined, {
  refetchOnMountOrArgChange: true,
});


   const auth = useSelector((state) => state.auth || {});
   const {cartItems} = useSelector((state) => state.cart || {});

   const user = auth.user;
   const navigate = useNavigate();
  const [logout] = useLogoutMutation();

const logoutHandler = async () => {
  await logout();
  navigate("/");
};
  
  return (
    <nav className="navbar row">
      {/* Logo */}
      <div className="col-12 col-md-3 ps-5">
        <div className="navbar-brand">
          <a href="/">
            <img
              src="/images/shopit_logo.png"
              alt="ShopIT Logo"
            />
          </a>
        </div>
      </div>

       <Search/>
      

      {/* Cart + User */}
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <a href="/cart" style={{ textDecoration: 'none' }}>
          <span id="cart" className="ms-3">Cart</span>
          <span className="ms-1" id="cart_count"> {cartItems?.length}</span>
        </a>


        {user? (
          <div className="ms-4 dropdown d-inline">
          <button
            className="btn dropdown-toggle text-white"
            type="button"
            id="dropDownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <figure className="avatar avatar-nav">
              <img
                src={user?.avatar ? user?.avatar?.url : "/images/default_avatar.jpg"}
                alt="User Avatar"
                className="rounded-circle"
              />
            </figure>
            <span>{user?.name}</span>
          </button>

          <div className="dropdown-menu w-100">
            <Link className="dropdown-item" to="/admin/dashboard">
              Dashboard
            </Link>
            <Link className="dropdown-item" to="/me/orders">
              Orders
            </Link>
            <Link className="dropdown-item" to="/me/profile">
              Profile
            </Link>
            <Link className="dropdown-item text-danger" to="/"  onClick={logoutHandler}>
              Logout
            </Link>
          </div>
        </div>

        ):(
          !isLoading && 
          <Link to="/login" className="btn ms-4" id="login_btn">
          Login
          </Link>
        )} 
        
      </div>
    </nav>
  )
}

export default Header
