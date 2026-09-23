import {
  Menu,
  Bell,
  CircleUser,
  ChevronDown
} from "lucide-react";


import "./Navbar.css"

const Navbar = () => {

  return (
    <header className="top-navbar">

      {/* Left */}
      <div className="navbar-left">

        <button className="navbar-menu-btn">
          <Menu size={30} />
        </button>

        <div className="navbar-title">
          <h1>Task Manager</h1>
        </div>

      </div>

      {/* Right */}
      <div className="navbar-right">

        <button className="navbar-notification">
          <Bell size={27} />

          <span className="notification-badge">
            3
          </span>
        </button>

        <div className="navbar-user">

          <div className="navbar-user-icon">
            <CircleUser size={42} />
          </div>

          <div className="navbar-user-info">
            <strong>
             Name
            </strong>

            <span>
              Task
            </span>
          </div>

          <ChevronDown size={20} />

        </div>

      </div>

    </header>
  );
};

export default Navbar;