import ProfileDropdown from '../profileDropDown/ProfileDropdown';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezones</p>
      </div>

      <ProfileDropdown />
    </div>
  );
}
