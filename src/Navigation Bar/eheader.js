import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

export const NavBar1 = () => {
  const [isAttendance, setIsAttendancePage] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
  }

  useEffect(() => {
    setIsAttendancePage(location.pathname === '/pir');
  }, [location]);

  return (
      <div className="navbarCustom">
      <MDBRow>
        <MDBCol>
          <button type="button" className="btn btn-danger float-end" onClick={handleLogout} ><Link to="/">Logout</Link></button>
        </MDBCol>
      </MDBRow>
      <MDBRow>
      <nav className="navbar navbar-expand-sm navbar text-uppercase" style={{ backgroundImage: "radial-gradient( circle 654px at 0.6% 48%, blue, lightblue)", backgroundColor: "blue" }}>
          <div className="container-fluid " >
            <ul className="navbar-nav ms-5 mt-2">
              <li className="nav-item">

              </li>
              <li className="nav-item">
                <Link className="btn btn-light btn-outline-primary" to="/pir">ATTENDANCE</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-light btn-outline-primary" to="/employeehome">LEAVE</Link>
                </li>
            </ul>
          </div>
        </nav>
      </MDBRow>

      <h1 style={{ textAlign: "center" }}>
        {isAttendance ? "Make Attendance" : "Leave Details"}
      </h1>
    </div>
  )
}
