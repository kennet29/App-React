import React from 'react';
import '../css/estilos-login.css';
import logo from './logo.jpg' // Asegúrate de importar tus estilos correctamente
import { NavLink } from 'react-router-dom';

const LoginView = () => {
  return (
    <div className="cont">
      <div className="cont_form">
        <img src={logo} alt="Logo" />
        <form id="frm">
          <input type="text" name="user" placeholder="Email" />
          <input type="password" name="password" placeholder="Contraseña" />
          <NavLink type="submit" className="btn-log" value="Entrar" to="/index"  >Entrar</NavLink>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
