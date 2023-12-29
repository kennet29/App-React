import React, { useState } from "react";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { TbColorSwatch } from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { FaTags } from "react-icons/fa";
import { GiRolledCloth } from "react-icons/gi";

import { FcShipped } from "react-icons/fc";
import { FcOvertime } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { FcPaid } from "react-icons/fc";
import { FcAlphabeticalSortingAz } from "react-icons/fc";
import { FcList } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FaArrowRightToBracket } from "react-icons/fa6";

import "./navbar.css";

const MyNavbar = () => {
  const [mobile, setMobile] = useState(false);

  const handleToggle = () => {
    setMobile(!mobile);
  };

  return (
    <Navbar style={{ marginLeft: '0 auto', padding: '5px' }} bg="dark" expand="lg" variant="dark">
      <Navbar.Brand style={{ marginLeft: '10px', fontSize: '30px', fontFamily: 'MV Boli' }} > Mafy<span style={{ color: '#e0ac1c', fontFamily: 'MV Boli' }}>Store</span></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle}>
        {mobile ? <ImCross /> : <FaBars />}
      </Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav" className={mobile ? "show" : ""}>
        <Nav className="mr-auto">

        <Nav.Link href="/index" to="/index" >
          Inicio
        </Nav.Link>

          <Nav.Link  href="/configuracion" to="/configuracion" >Configuración</Nav.Link>
          <NavDropdown title="Ventas">
            <NavDropdown.Item > <FcCurrencyExchange style={{ fontSize: '30px' }}></FcCurrencyExchange>Realizar Venta</NavDropdown.Item>
            <NavDropdown.Item href="#"> <FcOvertime style={{ fontSize: '30px' }} />Historial</NavDropdown.Item>
            <NavDropdown.Item href="#"> <FcPaid style={{ fontSize: '30px' }} /> Devolucion</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Ingresos">
            <NavDropdown.Item href="#"> <FcCurrencyExchange style={{ fontSize: '30px' }} /> Nueva Compra</NavDropdown.Item>
            <NavDropdown.Item href="#"> <FcOvertime style={{ fontSize: '30px' }} />Historial</NavDropdown.Item>
            <NavDropdown.Item href="#"> <FcPaid style={{ fontSize: '30px' }} /> Devolucion</NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Catalogos">

            <NavDropdown.Item style={{ color: 'black' }}>
              <NavLink to="/colores" style={{ color: 'black' }} className="nav-link">
                <IoColorPaletteOutline style={{ color: 'black', fontSize: '20px' }} /> Colores
              </NavLink>
            </NavDropdown.Item>


            <NavDropdown.Item href="#">

              <NavLink to="/categorias" className="nav-link" style={{ color: 'black' }}>
                <FcList style={{ fontSize: '20px', color: 'black' }} /> Categorias
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/disenos" style={{ color: 'black' }} className="nav-link">
                <TbColorSwatch style={{ color: 'black', fontSize: '20px' }} />Diseños
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/estilos" style={{ color: 'black' }} className="nav-link">
                <GiClothes style={{ color: 'black', fontSize: '20px' }} />Estilos
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/tallas" style={{ color: 'black' }} className="nav-link">
                <FcAlphabeticalSortingAz style={{ fontSize: '20px' }} />Tallas
              </NavLink>
            </NavDropdown.Item>

          

            <NavDropdown.Item href="#">
              <NavLink to="/marcas" style={{ color: 'black' }} className="nav-link">
                <FaTags style={{ color: 'black', fontSize: '20px' }} />Marcas
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/materiales" style={{ color: 'black' }} className="nav-link">
                <GiRolledCloth style={{ color: 'darkred', fontSize: '20px' }} /> Materiales
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/promociones" style={{ color: 'black' }} className="nav-link">
                <FcCalendar  style={{ color: 'black', fontSize: '20px' }} /> Promociones
              </NavLink>
            </NavDropdown.Item>

           

            <NavDropdown.Item href="#">
              <NavLink to="/proveedores" style={{ color: 'black' }} className="nav-link">
                <FcShipped style={{ color: 'black', fontSize: '20px' }} />Proveedores
              </NavLink>
            </NavDropdown.Item>

          </NavDropdown>
        </Nav>

      </Navbar.Collapse>
      <Nav>
        <Nav.Link href="#" style={{ marginRight: '5px' }} className="ml-auto">   Cerrar Sesión  <FaArrowRightToBracket /></Nav.Link>
      </Nav>
    </Navbar>
  );
};



export default MyNavbar;
