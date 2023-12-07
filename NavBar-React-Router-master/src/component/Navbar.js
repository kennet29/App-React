import React, { useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const Navbar = () => {
  const [Mobile, setMobile] = useState(false);

  return (
    <>
      <nav className='navbar'>
        <h3 className='logo'>Mafy Store</h3>
        <ul className={Mobile ? "nav-links-mobile" : "nav-links"} onClick={() => setMobile(false)}>
          <Link to='/' className='home' onClick={() => setMobile(false)}>
            <li>Inicio</li>
          </Link>
          <Link to='/colores' className='colors' onClick={() => setMobile(false)}>
            <li>Ingresos</li>
          </Link>
          <Link to='/configuracion' className='services' onClick={() => setMobile(false)}>
            <li>Configuracion</li>
          </Link>
          <Link to='/ventas' className='skills' onClick={() => setMobile(false)}>
            <li>Ventas</li>
          </Link>
          <Link to='/contact' className='home' onClick={() => setMobile(false)}>
            <li>Cerrar Sesion</li>
          </Link>
        </ul>
        <button className='mobile-menu-icon' onClick={() => setMobile(!Mobile)}>
          {Mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
