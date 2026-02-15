import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <div style={styles.navbar}>
      <h2>🌾 CropCare Advisor</h2>

      <ul style={styles.navList}>
        <li>
          <NavLink to="/" style={navStyle}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/map" style={navStyle}>
            Live Map
          </NavLink>
       </li>

        <li>
          <NavLink to="/alerts" style={navStyle}>
            Alerts
          </NavLink>
        </li>

        <li>
          <NavLink to="/insights" style={navStyle}>
            Insights
          </NavLink>
        </li>

        <li>
          <NavLink to="/ops" style={navStyle}>
            Ops Center
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" style={navStyle}>
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

const navStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  color: isActive ? "#38bdf8" : "white",
  textDecoration: "none",
  fontWeight: isActive ? "bold" : "normal",
});

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1e293b",
    color: "white",
  },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "25px",
    margin: 0,
    padding: 0,
  },
};

export default Navbar;
