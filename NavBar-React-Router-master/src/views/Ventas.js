import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import Footer from '../component/footer/footer';
import { FaArrowRight, FaSearch } from 'react-icons/fa';

const VentasView = () => {
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [est, setEst] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = async () => {
    await fetchData();
    console.log('Stock Data:', stockData);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

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

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/stock');
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const columns = [
    
    { name: 'Articulo ID', selector: 'Id_articulo', sortable: true },
    { name: 'Color ID', selector: 'Id_color', sortable: true },
    { name: 'Marca ID', selector: 'Id_marca', sortable: true },
    { name: 'Talla ID', selector: 'Id_talla', sortable: true },
    { name: 'Estilo ID', selector: 'Id_estilo', sortable: true },
    { name: 'Material ID', selector: 'Id_material', sortable: true },
    { name: 'Diseño ID', selector: 'Id_diseño', sortable: true },
    { name: 'Descuento', selector: 'Descuento', sortable: true },
    { name: 'Precio Venta', selector: 'Precio_venta', sortable: true },
    { name: 'Estado', selector: 'Estado', sortable: true, cell: row => (row.Estado ? 'Activo' : 'Inactivo') },
    {
      
      name: 'Opciones',
      cell: (row) => (
        <Button style={{width:'40px',height:'40px'}} >
          <FaArrowRight />
        </Button>
      ),
    },
  ];

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
          <Form.Control type="text" style={estilos.inputStyle2} className="form-control" />
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

          <Col md={2} style={{ marginTop: '40px' }}>
            <Button style={estilos.search} variant="outline-secondary" onClick={handleShowModal}>
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
          <Button variant="primary" style={estilos.buttonSave} size="lg">
            Agregar Articulo
          </Button>
          <Button variant="danger" style={estilos.buttonSave} size="lg">
            Limpiar
          </Button>
        </Row>
      </Form>

      <Button
        variant="success"
        style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }}
      >
        Facturar Ingreso
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Stock Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {stockData.length > 0 ? (
            <DataTable columns={columns} data={stockData} pagination />
          ) : (
            <p>Loading data...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </Container>
  );
};

export default VentasView;
