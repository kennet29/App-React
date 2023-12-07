import React, { Component } from 'react';
import axios from 'axios'; // Importa axios
import '../css/ConfigView.css';
import Navbar from '../component/Navbar';
import Footer from '../component/footer/footer';

class ConfigView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      nombre_negocio: '',
      direccion: '',
      correo_electronico: '',
      telefono_1: '',
      telefono_2: '',
      eslogan: '',
      tipo_de_cambio_dolar: '',
    };
  }

  componentDidMount() {
    if (this.state.isEditing) {
      this.fetchData();
    }
  }

  fetchData() {
    axios.get('http://localhost:4000/api/configuracion')
      .then(response => {
        this.setState({
          nombre_negocio: response.data.nombre_negocio || '',
          direccion: response.data.direccion || '',
          correo_electronico: response.data.correo_electronico || '',
          telefono_1: response.data.telefono_1 || '',
          telefono_2: response.data.telefono_2 || '',
          eslogan: response.data.eslogan || '',
          tipo_de_cambio_dolar: response.data.tipo_de_cambio_dolar || '',
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  handleEditClick = () => {
    this.setState({ isEditing: true }, () => {
      this.fetchData();
    });
  };

  handleSaveClick = () => {
    // Agrega lógica para guardar los datos editados
    // Puedes realizar una solicitud PUT al servidor, por ejemplo
    this.setState({ isEditing: false });
  };

  render() {
    return (
      <div className="config-container">
        <Navbar />
        <h1 className="config-title">Configuracion</h1>
        <div className="config-grid">
          <form className="config-form">
            <div className="config-column">
              <label htmlFor="nombre_negocio">Nombre del Negocio</label>
              <input
                type="text"
                id="nombre_negocio"
                name="nombre_negocio"
                value={this.state.isEditing ? this.state.nombre_negocio : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />

              <label className="campos" htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={this.state.isEditing ? this.state.direccion : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />

              <label className="campos" htmlFor="correo_electronico">Correo Electrónico</label>
              <input
                type="text"
                id="correo_electronico"
                name="correo_electronico"
                value={this.state.isEditing ? this.state.correo_electronico : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />

              <label className="campos" htmlFor="telefono_1">Teléfono 1</label>
              <input
                type="text"
                id="telefono_1"
                name="telefono_1"
                value={this.state.isEditing ? this.state.telefono_1 : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />
            </div>

            <div className="config-column">
              <label className="campos" htmlFor="telefono_2">Teléfono 2</label>
              <input
                type="text"
                id="telefono_2"
                name="telefono_2"
                value={this.state.isEditing ? this.state.telefono_2 : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />

              <label htmlFor="eslogan">Eslogan</label>
              <input
                type="text"
                id="eslogan"
                name="eslogan"
                value={this.state.isEditing ? this.state.eslogan : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />

              <label className='etiqueta' htmlFor="tipo_de_cambio_dolar">Tipo de Cambio Dólar</label>
              <input
                type="text"
                id="tipo_de_cambio_dolar"
                name="tipo_de_cambio_dolar"
                value={this.state.isEditing ? this.state.tipo_de_cambio_dolar : ''}
                className="config-input campos"
                readOnly={!this.state.isEditing}
              />
            </div>
          </form>
        </div>
        <button type="button" className="config-button" onClick={this.handleSaveClick} disabled={!this.state.isEditing}>
          Guardar
        </button>
        <button type="button" className="edit-button" onClick={this.handleEditClick} disabled={this.state.isEditing}>
          Editar
        </button>
        <Footer />
      </div>
    );
  }
}

export default ConfigView;
