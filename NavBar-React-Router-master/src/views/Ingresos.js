import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal,Alert } from 'react-bootstrap';

import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import axios from 'axios';
import Footer from '../component/footer/footer';


const IngresosView = () => {
  const [articulos, setArticulos] = useState([]);
  const [tallas, setTallas] = useState([]);
  
  const [colores, setColores] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [est, setEst] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [articulosIngresados, setArticulosIngresados] = useState([]);
  const [subTotalTotal, setSubTotalTotal] = useState(0);
  const [descuentosTotal, setDescuentosTotal] = useState(0);
  const [ivaTotal, setIvaTotal] = useState(0);

  const [total, setTotal] = useState(0);
  const [editIndex, setEditIndex] = useState(-1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false); 
  const [idMarcaSeleccionada, setIdMarcaSeleccionada] = useState('');
  const [formulario, setFormulario] = useState({
    idArticulo: '',
    idProveedor: '', 
    idTalla: '',
    idColor: '',
    cantidad: '',
    idMarca: '',
    idMaterial: '',
    idEstilo: '',
    idDiseño: '',
    descuento: '',
    precioprov:'',
    total: '',
  });

  
 

  useEffect(() => {
    // Fetch the list of articles when the component mounts
    const fetchArticulos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/articulos');
        setArticulos(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticulos();
  }, []);


  useEffect(() => {
    // Fetch the list of suppliers when the component mounts
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchProveedores();
  }, []);

  useEffect(() => {
    // Fetch the list of colors when the component mounts
    const fetchColores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/colores');
        setColores(response.data);
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    };

    fetchColores();
  }, []);

 


  useEffect(() => {
    const subTotal = articulosIngresados.reduce((total, articulo) => {
      const iva = parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
      const discountedPrice = parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2));
      return total + discountedPrice + iva;
    }, 0);
    setSubTotalTotal(subTotal);
  
    const descuentos = articulosIngresados.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);
  
    const iva = articulosIngresados.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  }, [articulosIngresados]);
  
  
  useEffect(() => {
    // Fetch the list of sizes when the component mounts
    const fetchTallas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tallas');
        setTallas(response.data);
        console.log('Tallas:', response.data); // Log the fetched data
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };

    fetchTallas();
  }, []);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormulario((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const updateTotals = (articulos) => {
    const subTotal = articulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);

    const descuentos = articulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);

    const iva = articulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  };

  const handleEliminarArticulo = (index) => {
    // Lógica para eliminar el artículo de la lista
    const nuevosArticulos = [...articulosIngresados];
    nuevosArticulos.splice(index, 1);
    setArticulosIngresados(nuevosArticulos);
  
    // Update totals after deleting an article
    const subTotal = nuevosArticulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);
  
    const descuentos = nuevosArticulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);
  
    const iva = nuevosArticulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  
    handleLimpiar();
  };

  useEffect(() => {
    // Fetch the list of brands when the component mounts
    const fetchMarcas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/marcas');
        setMarcas(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchMarcas();
  }, []);


  useEffect(() => {
    // Fetch the list of materials when the component mounts
    const fetchMateriales = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/materiales');
        setMateriales(response.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMateriales();
  }, []);

  useEffect(() => {
    // Fetch the list of styles when the component mounts
    const fetchEstilos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/estilos');
        setEst(response.data);
      } catch (error) {
        console.error('Error fetching styles:', error);
      }
    };

    fetchEstilos();
  }, []);

  useEffect(() => {
    // Fetch the list of designs when the component mounts
    const fetchDisenos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/disenos');
        setDisenos(response.data);
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
    };

    fetchDisenos();
  }, []);


  const calculateIVA = (cantidad, precio, descuento) => {
    const precioConDescuento = precio * (1 - descuento / 100);
    const ivaPercentage = 15; // Cambiar si el porcentaje de IVA es diferente
    const iva = (cantidad * precioConDescuento * ivaPercentage) / 100;
    return iva.toFixed(2);
  };


  const handleGuardar = () => {
    // Validación de campos antes de guardar
    if (
      formulario.idArticulo === '' ||
      formulario.idTalla === '' ||
      formulario.idColor === '' ||
      formulario.idMarca === '' ||
      formulario.idMaterial === '' ||
      formulario.idEstilo === '' ||
      formulario.idDiseño === '' ||
      formulario.cantidad === '' ||
      formulario.precioprov === '' ||
      formulario.descuento === ''
    ) {
      // Muestra la alerta si algún campo está vacío
      setShowAlert(true);
      handleLimpiar();
      return;
    }
  
    // Resto del código para guardar el artículo...
  
    // If editIndex is not -1, update the existing record
    if (editIndex !== -1) {
      setArticulosIngresados((prevArticulos) => {
        const updatedArticulos = [...prevArticulos];
        updatedArticulos[editIndex] = formulario;
        return updatedArticulos;
      });
    } else {
      // Append the new record to the array
      setArticulosIngresados((prevArticulos) => [...prevArticulos, formulario]);
    }
  
    // Después de actualizar la lista de artículos ingresados, actualiza los totales
    const updatedArticulos = [...articulosIngresados, formulario];
  
    const subTotal = updatedArticulos.reduce((total, articulo) => {
      return (
        total +
        parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)) +
        parseFloat((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)).toFixed(2))
      );
    }, 0);
    setSubTotalTotal(subTotal);
  
    const descuentos = updatedArticulos.reduce((total, articulo) => {
      return total + parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2));
    }, 0);
    setDescuentosTotal(descuentos);
  
    const iva = updatedArticulos.reduce((total, articulo) => {
      return total + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento));
    }, 0);
    setIvaTotal(iva);
  
    // Limpiar los campos después de agregar el artículo
    handleLimpiar();
  
    // Cerrar el modal después de guardar correctamente
    setShowEditModal(false);
  };
  
  
  


  const handleEditarArticulo = (index) => {
    // Mostrar el modal de edición con los datos del artículo seleccionado
    setFormulario({ ...articulosIngresados[index] });
    setEditIndex(index);
    setShowEditModal(true);
  };
  
const handleFacturarIngreso = async () => {
  try {
    // Primera solicitud POST para crear el ingreso
    const ingresoData = {
      id_usuario: "652b4bac458db698d7db1485",
      id_proveedor: formulario.idProveedor,
      fecha: new Date().toISOString(),
      iva: ivaTotal,
      descuento: descuentosTotal,
      subtotal: subTotalTotal,
      total: subTotalTotal - descuentosTotal + ivaTotal,
    };

    console.log('Datos del ingreso a enviar:', ingresoData);

    const responseIngreso = await axios.post('http://localhost:4000/api/ingresos', ingresoData);
    const idIngreso = responseIngreso.data._id;

    // Segunda solicitud POST con datos de la tabla de artículos
    const articulosData = {
      id_ingreso: idIngreso,
      articulos: articulosIngresados.map((articulo) => ({
        id_articulo: articulo.idArticulo,
        id_talla: articulo.idTalla,
        id_color: articulo.idColor,
        id_marca: articulo.idMarca, // Enviar el ID de la marca en lugar del nombre
        id_material: articulo.idMaterial,
        id_estilo: articulo.idEstilo,
        id_diseño: articulo.idDiseño,
        cantidad: parseInt(articulo.cantidad),
        precio_proveedor: parseFloat(articulo.precioprov),
        iva: parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)),
        descuento: parseFloat((articulo.cantidad * articulo.precioprov * (articulo.descuento / 100)).toFixed(2)),
        subtotal: parseFloat(((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)) + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento))).toFixed(2)),
      })),
      total: subTotalTotal - descuentosTotal + ivaTotal,
    };

    console.log('Datos de los artículos a enviar:', articulosData);

    const responseArticulos = await axios.post('http://localhost:4000/api/detalleingreso', articulosData);

    // ... (otras lógicas que puedas necesitar)

    console.log('Ingreso y artículos facturados correctamente:', responseIngreso, responseArticulos);
  } catch (error) {
    console.error('Error al facturar ingreso:', error);
  }
};

  
  

  

  const handleLimpiar = () => {
    // Clear the input fields
    setFormulario({
      idArticulo: '',
      idProveedor: '',
      idTalla: '',
      idColor: '',
      cantidad: '',
      idMarca: '',
      idMaterial: '',
      idEstilo: '',
      idDiseño: '',
      descuento: '',
      precioprov:'',
      total: '',
    });
  };
  
  return (


    <Container fluid style={estilos.containerStyle}>
 <Form style={{ width: '95%', backgroundColor: 'white', marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
  <Form.Group controlId="formFechaVenta" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '35px'}}>
    <Form.Label style={{ marginBottom: '5px' }}>Fecha de Venta</Form.Label>
    <Form.Control type="date" style={{ width: '70%', alignSelf: 'flex-start' }} />
  </Form.Group>

  <Form.Group controlId="formProveedor" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Form.Label style={{ marginBottom: '5px' }}>Proveedor</Form.Label>
        <select
          className="form-control"
          style={{ width: '70%', alignSelf: 'flex-start', marginRight: '35px' }}
          value={formulario.idProveedor}
          onChange={(e) => setFormulario({ ...formulario, idProveedor: e.target.value })}
        >
          <option value="">Proveedores...</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor._id} value={proveedor._id}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </Form.Group>

</Form>





      <h2 className=" mt-4 center-text" style={estilos.titulo}>
        Registro de Ingresos
      </h2>

      <Form style={estilos.formStyle}>
        <fieldset className="form-row">


          <Row>
            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-articulo">
                Articulo
              </label>
              <select
                id="id-articulo"
                className="form-control"
                value={formulario.idArticulo}
                onChange={(e) => setFormulario({ ...formulario, idArticulo: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Artículos...</option>
                {articulos.map((articulo) => (
                  <option key={articulo.id} value={articulo.id}>
                    {articulo.nombre}
                  </option>
                ))}
              </select>
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle3} htmlFor="id-talla">
                Talla
              </label>
              <select
                id="id-talla"
                className="form-control"
                value={formulario.idTalla}
                onChange={(e) => setFormulario({ ...formulario, idTalla: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Tallas...</option>
                {tallas.map((talla) => (
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
              <select
                id="id-color"
                className="form-control"
                value={formulario.idColor}
                onChange={(e) => setFormulario({ ...formulario, idColor: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Colores...</option>
                {colores.map((color) => (
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
              <select
                id="id-marca"
                className="form-control"
                value={formulario.idMarca}
                onChange={(e) => setFormulario({ ...formulario, idMarca: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Marcas...</option>
                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.marca}
                  </option>
                ))}
              </select>
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-material">
                Material
              </label>
              <select
                id="id-material"
                className="form-control"
                value={formulario.idMaterial}
                onChange={(e) => setFormulario({ ...formulario, idMaterial: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Materiales...</option>
                {materiales.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.material}
                  </option>
                ))}
              </select>
            </Col>

            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-estilo">
                Estilo
              </label>
              <select
                id="id-estilo"
                className="form-control"
                value={formulario.idEstilo}
                onChange={(e) => setFormulario({ ...formulario, idEstilo: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Estilos...</option>
                {est.map((estilo) => (
                  <option key={estilo.id} value={estilo.id}>
                    {estilo.estilo}
                  </option>
                ))}
              </select>
            </Col>
          </Row>

          <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />

          <Row>




            <Col md={2}>
              <label style={estilos.labelStyle} htmlFor="id-diseno">
                Diseño
              </label>
              <select
                id="id-diseno"
                className="form-control"
                value={formulario.idDiseño}
                onChange={(e) => setFormulario({ ...formulario, idDiseño: e.target.value })}
                required
                style={estilos.inputStyle}
              >
                <option value="">Diseños ...</option>
                {disenos.map((diseno) => (
                  <option key={diseno.id} value={diseno.id}>
                    {diseno.diseno}
                  </option>
                ))}
              </select>


            </Col>

            <Col md={2}>
              <label htmlFor="cantidad" style={estilos.labelStyle}>
                Cantidad
              </label>
              <input
                type="text"
                id="cantidad"
                className="form-control"
                value={formulario.cantidad}
                onChange={handleInputChange}
                required
                style={estilos.inputStyle}
              />
            </Col>

            <Col md={2}>
              <label htmlFor="Precio Proveedor" style={estilos.labelStyle4}>
                Precio-Prov
              </label>
              <input
                type="text"
                id="precioprov"
                className="form-control"
                value={formulario.precioprov}
                onChange={handleInputChange}
                required
                style={estilos.inputStyle}
              />
            </Col>

            <Col md={2}>
              <label htmlFor="descuento" style={estilos.labelStyle}>
                Descuento X Unidad
              </label>
              <input
                type="number"
                id="descuento"
                className="form-control"
                value={formulario.descuento}
                onChange={handleInputChange}
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
              onClick={handleGuardar}
            >
              Agregar Articulo
            </Button>
            <Button
              variant="danger"
              style={estilos.buttonSave}
              size="lg"
              onClick={handleLimpiar}
            >
              Limpiar
            </Button>
          </Row>
        </fieldset>
      </Form>

      {showAlert && (
        <Alert variant="danger" style={{width:'50%', margin:'0 auto', marginTop:'10px'}} onClose={() => setShowAlert(false)} dismissible>
          Por favor, completa todos los campos antes de agregar el artículo.
        </Alert>
      )}


      {articulosIngresados.length > 0 && (
        <div style={{ marginTop: '10px', width: '90%', marginLeft: '5%', overflowX: 'auto' }}>
          <h3 style={{ color: 'white', textAlign: 'center' }} >Artículos Ingresados</h3>
          <table style={{ textAlign: 'center' }} className="table table-bordered table-striped"  >
            <thead  >
              <tr style={{ backgroundColor: '#00FFBD' }} >
                <th>Articulo</th>
                <th>Talla</th>
                <th>Color</th>
                <th>Marca</th>
                <th>Material</th>
                <th>Diseño</th>
                <th>Estilo</th>
                <th>Cantidad</th>
                <th>Precio-prov</th>
                <th>Descuento</th>
                <th>IVA</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulosIngresados.map((articulo, index) => (
                <tr key={index}>
                  <td>{articulo.idArticulo}</td>
                  <td>{articulo.idTalla}</td>
                  <td>{articulo.idColor}</td>
                  <td>{articulo.idMarca}</td>
                  <td>{articulo.idMaterial}</td>
                  <td>{articulo.idDiseño}</td>
                  <td>{articulo.idEstilo}</td>
                  <td>{articulo.cantidad}</td>
                  <td>{articulo.precioprov}</td>
                  <td>{articulo.descuento}</td>
                  <td>{calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento)}</td>
                  <td>{((articulo.cantidad * articulo.precioprov * (1 - articulo.descuento / 100)) + parseFloat(calculateIVA(articulo.cantidad, articulo.precioprov, articulo.descuento))).toFixed(2)}</td>
                  <td>
                    <Button
                      style={{ width: '75px', height: '35px', marginRight: '5px' }}
                      variant="info"
                      size="sm"
                      onClick={() => handleEditarArticulo(index)}
                    >
                      Editar
                    </Button>

                    <Button style={{ width: '75px', height: '35px' }}
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarArticulo(index)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{color:'white'}}>
  <strong>Total: C${subTotalTotal.toFixed(2)}</strong>
</div>
<div style={{color:'white'}}>
  <strong>Descuentos Total: C${descuentosTotal.toFixed(2)}</strong>
</div>
<div style={{color:'white'}}>
  <strong>IVA Total: C${ivaTotal.toFixed(2)}</strong>
</div>
<div style={{color:'white'}}>
  <strong>Subtotal: C${(subTotalTotal - descuentosTotal + ivaTotal).toFixed(2)}</strong>
</div>
        </div>
      )}

<Button
      variant="success"
      style={{ width: '150px', height: '50px', marginTop: '20px',marginLeft:'45%' }}  
      onClick={handleFacturarIngreso}
    >
      Facturar Ingreso
    </Button>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header style={{ backgroundColor: '#4a4a4a', color: 'white' }} closeButton>
          <Modal.Title>Editar Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#4a4a4a', color: 'white' }}>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formPrecioProv">
                  <Form.Label>Precio Proveedor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Precio del Proveedor"
                    value={formulario.precioprov}
                    onChange={(e) => setFormulario({ ...formulario, precioprov: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formDescuento">
                  <Form.Label>Descuento %</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Descuento por Unidad"
                    value={formulario.descuento}
                    onChange={(e) => setFormulario({ ...formulario, descuento: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCantidad">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Cantidad"
                    value={formulario.cantidad}
                    onChange={(e) => setFormulario({ ...formulario, cantidad: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>


        <Modal.Footer style={{ backgroundColor: '#4a4a4a', color: 'white' }}>
          <Button variant="primary" onClick={handleGuardar} style={{ width: '100px', height: '50px' }} >
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} style={{ width: '100px', height: '50px' }}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </Container>

  );
};

export default IngresosView;