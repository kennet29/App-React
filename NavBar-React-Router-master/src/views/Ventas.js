import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import Footer from '../component/footer/footer';
import { FaSearch } from 'react-icons/fa';

const VentasView = () => {
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [est, setEst] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async (endpoint, setDataFunction) => {
      try {
        const response = await fetch(`http://localhost:4000/api/${endpoint}`);
        const data = await response.json();
        setDataFunction(data);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };
    fetchData('tallas', setTallas);
    fetchData('colores', setColores);
    fetchData('marcas', setMarcas);
    fetchData('materiales', setMateriales);
    fetchData('estilos', setEst);
    fetchData('disenos', setDisenos);
  }, []);
  
  const listArticulos = () => {
   
    console.log('Listing Articulos...');
  };

  return (
    <Container fluid style={estilos.containerStyle}>
      <h2 className=" mt-4 center-text" style={estilos.titulo}>
        Registro de Ventas
      </h2>
      <Form style={{ width: '95%', backgroundColor: 'white', marginTop: '10px', marginLeft: '3%', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Form.Group controlId="formFechaVenta" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '55px' }}>
          <Form.Label style={{ marginLeft: '40px' }}>Fecha de Venta</Form.Label>
          <Form.Control type="date" className="form-control" style={estilos.inputStyle2} />
        </Form.Group>
        <Form.Group controlId="formProveedor" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Form.Label style={{ marginLeft: '50px' }}>Cliente</Form.Label>
          <Form.Control type="text" style={estilos.inputStyle2} className="form-control">
          </Form.Control>
        </Form.Group>
      </Form>

    

      <Form style={estilos.formStyle2}>
        
          <Row>
            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-articulo">
                Articulo
              </label>
              <select style={estilos.inputStyle} className="form-control">
                <option value="">Artículos...</option>
              </select>
            
            </Col>

    <Col md={2} style={{marginTop:'40px'}}>
    <Button style={estilos.search} variant="outline-secondary" onClick={listArticulos}>
            <FaSearch />  
          </Button>
    </Col>


            <Col md={2}>
        <label style={estilos.labelStyle3} htmlFor="id-talla">
          Talla
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Tallas...</option>
          {tallas.map(talla => (
            <option key={talla.id} value={talla.id}>
              {talla.talla}
            </option>
          ))}
        </select>
      </Col>

      <Col md={2}>
        <label style={estilos.labelStyle3} htmlFor="id-color">
          Color
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Colores...</option>
          {colores.map(color => (
            <option key={color.id} value={color.id}>
              {color.color}
            </option>
          ))}
        </select>
      </Col>

      <Col md={2}>
        <label style={estilos.labelStyle3} htmlFor="id-marca">
          Marca
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Marcas...</option>
          {marcas.map(marca => (
            <option key={marca.id} value={marca.id}>
              {marca.marca}
            </option>
          ))}
        </select>
      </Col>
 
          </Row>
          <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />
          <Row>
          <Col md={2}>
        <label style={estilos.labelStyle} htmlFor="id-material">
          Material
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Materiales...</option>
          {materiales.map(material => (
            <option key={material.id} value={material.id}>
              {material.material}
            </option>
          ))}
        </select>
      </Col>

      <Col md={2}>
        <label style={estilos.labelStyle} htmlFor="id-diseno">
          Diseño
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Diseños...</option>
          {disenos.map(diseno => (
            <option key={diseno.id} value={diseno.id}>
              {diseno.diseno}
            </option>
          ))}
        </select>
      </Col>


            <Col md={2}>
        <label style={estilos.labelStyle} htmlFor="id-estilo">
          Estilo
        </label>
        <select style={estilos.inputStyle} className="form-control">
          <option value="">Estilos...</option>
          {est.map(estilo => (
            <option key={estilo.id} value={estilo.id}>
              {estilo.estilo}
            </option>
          ))}
        </select>
      </Col>

            <Col md={2}>
              <label htmlFor="Precio Proveedor" style={estilos.labelStyle4}>
                Cantidad
              </label>
              <input
                type="text"
                id="precioprov"
                className="form-control"

                required
                style={estilos.inputStyle}
              />
            </Col>
          </Row>

          <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />

          <Row>
            <Button
              variant="primary"
              style={estilos.buttonSave}
              size="lg"
            >
              Agregar Articulo
            </Button>
            <Button
              variant="danger"
              style={estilos.buttonSave}
              size="lg"
            >
              Limpiar
            </Button>
          </Row>
        
      </Form>

      <Button
        variant="success"
        style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }}>
        Facturar Ingreso
      </Button>
      <Footer />
    </Container>

  );
};

export default VentasView;