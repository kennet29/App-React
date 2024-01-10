import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import Footer from '../component/footer/footer';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from "react-icons/md";


const VentasView = () => {

  const estadoFormatter = row => (row.Estado ? 'Activo' : 'Descontinuados');
  const danosFormatter = row => (row.Daños ? 'Sí' : 'No');

  const bodegaFormatter = row => (row.Id_bodega ? row.Id_bodega : 'S/B');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [est, setEst] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [stockData, setStockData] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
        const response = await axios.get('http://localhost:4000/api/stock');
        const receivedStockData = response.data;
        setStockData(receivedStockData);
    };

    fetchData();
  }, []);

useEffect(() => {
    const fetchTallas = async () => {
        const response = await axios.get('http://localhost:4000/api/tallas');
        setTallas(response.data);
    };
    fetchTallas();
  }, []);


  useEffect(() => {
    const fetchPromotions = async () => {
        const response = await axios.get('http://localhost:4000/api/promociones');
        setPromotions(response.data);
    };

    fetchPromotions();
  }, []);

  const filteredData = stockData.filter(item => (item.Existencias !== null && item.Existencias !== 0) && item.Estado);

  const handleAddToCart = (row) => {
  const { _id, Id_articulo, Id_categoria, Id_marca, Id_color, Id_estilo, Id_material, Id_talla, Id_diseño, Existencias, Precio_venta, Descuento, Descuento_maximo, Id_promocion } = row;

  const isItemInCart = selectedItems.some((item) => item._id === _id);
  if (isItemInCart) {
    toast.error('Este Articulo ya a sido seleccionado', { position: toast.POSITION.TOP_CENTER });
    return;
  }

  const newItem = {
    _id,
    Id_articulo,
    Id_categoria,
    Id_marca,
    Id_color,
    Id_estilo,
    Id_material,
    Id_talla,
    Id_diseño,
    cantidad: 1,
    precio: Precio_venta,
    subtotal: Precio_venta,
    descuento: row.Daños ? Descuento_maximo : Descuento, // Use Descuento_maximo for damaged items
    Existencias,
    Id_promocion,
  };

  setSelectedItems([...selectedItems, newItem]);
  setSelectedRow(row);
};


  const [requestStatus, setRequestStatus] = useState({ loading: false, success: false, error: null });

  const handleRealizarVenta = async () => {
    setRequestStatus({ loading: true, success: false, error: null });
    try {
      const selectedItemsWithNumberQuantity = selectedItems.map(item => ({
        ...item,
        cantidad: parseInt(item.cantidad, 10), 
      }));
      const ventaData = {
        items: selectedItemsWithNumberQuantity,
      };

  
      console.log('Data being sent in the POST request:', ventaData);
      const response = await axios.post('http://localhost:4000/api/realizar-venta', ventaData);
 
      setRequestStatus({ loading: false, success: true, error: null });
      console.log('Venta realizada con éxito:', response.data);
    } catch (error) {

      setRequestStatus({ loading: false, success: false, error: error.message });
      console.error('Error realizando la venta:', error);
    }
  };
 
  useEffect(() => {
    const fetchColores = async () => {
        const response = await axios.get('http://localhost:4000/api/colores');
        setColores(response.data);
    };
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchArticulos = async () => {
        const response = await axios.get('http://localhost:4000/api/articulos');
        setArticulos(response.data);
    };
    fetchArticulos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
        const response = await axios.get('http://localhost:4000/api/categorias');
        setCategorias(response.data);
    };
    fetchCategorias();
  }, []); 

  useEffect(() => {
    const fetchEstilos = async () => {
        const response = await axios.get('http://localhost:4000/api/estilos');
        setEst(response.data);
    };
    fetchEstilos();
  }, []);

  useEffect(() => {
    const fetchMarcas = async () => {
        const response = await axios.get('http://localhost:4000/api/marcas');
        setMarcas(response.data);
    };
    fetchMarcas();
  }, []);

  useEffect(() => {
    const fetchDisenos = async () => {
        const response = await axios.get('http://localhost:4000/api/disenos');
        setDisenos(response.data);
    };
    fetchDisenos();
  }, []);

  useEffect(() => {
    const fetchMateriales = async () => {
        const response = await axios.get('http://localhost:4000/api/materiales');
        setMateriales(response.data);
    };
    fetchMateriales();
  }, []);


  const getMaterialNameById = (materialId) => {
    const material = materiales.find((m) => m._id === materialId);
    return material ? material.material : 'Nombre no encontrado';
  };


const obtenerNombreDisenoPorId = (idDiseno) => {
  const disenoSeleccionado = disenos.find(diseno => diseno._id === idDiseno);
  return disenoSeleccionado ? disenoSeleccionado.diseno : 'Diseño no encontrado';
};
  
const getNombreArticulo = (idArticulo) => {
    const articulo = articulos.find((a) => a._id === idArticulo);
    return articulo ? articulo.nombre : 'Desconocido';
  }; 

  
  const handleEditOpen = (item) => {
    setEditingItem(item);
    setNewQuantity(item.cantidad);
  };
  

  const getDiscountById = (promoId) => {
    const promotion = promotions.find((p) => p._id === promoId);
    return promotion ? promotion.descuento : 0;
  };


  const handleEditSave = () => {
    const newQuantityNumber = parseInt(newQuantity, 10);
    console.log('Existencias.',editingItem.Existencias);
    if (newQuantityNumber > editingItem.Existencias) {
    
      toast.error('Stock insuficiente',{ position: toast.POSITION.TOP_CENTER });
      return;
    }
  

    const updatedItems = selectedItems.map((item) =>
      item._id === editingItem._id ? { ...item, cantidad: newQuantityNumber } : item
    );
  
    setSelectedItems(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = selectedItems.filter(item => item._id !== itemId);
    setSelectedItems(updatedItems);
  };
  
  
  
  const handleEditClose = () => {
    setEditingItem(null);
  };
  
  const getNombreTalla = (idTalla) => {
    const tallaEncontrada = tallas.find((talla) => talla._id === idTalla);
    return tallaEncontrada ? tallaEncontrada.talla : 'Desconocida';
  };
  const getColorNameById = (colorId) => {
    const color = colores.find((c) => c._id === colorId);
    return color ? color.color : 'Desconocido';
  };
  const getNombreCategoriaById = (categoriaId) => {
    const categoria = categorias.find((c) => c._id === categoriaId);
    return categoria ? categoria.categoria : 'Desconocido';
  };
  const mapEstiloIdToNombre = (id) => {
    const estilo = est.find((e) => e._id === id);
    return estilo ? estilo.estilo : 'Desconocido ';
  };

  
  const getMarcaNombreById = (id) => {
    const marca = marcas.find((marca) => marca._id === id);
    return marca ? marca.marca : '';
  };

  const tableData = filteredData;
  const columns = [
    { name: '_id', selector: '_id', sortable: true },
    {
      name: 'Articulo',
      selector: 'Id_articulo',
      sortable: true,
      cell: (row) => getNombreArticulo(row.Id_articulo),
    },
    { name: 'Categoria', selector: 'Id_categoria', sortable: true, cell: (row) => getNombreCategoriaById(row.Id_categoria) },
    { name: 'Color', selector: 'Id_color', sortable: true, cell: (row) => getColorNameById(row.Id_color) },
    { name: 'Marca', selector: 'Id_marca', sortable: true, cell: (row) => getMarcaNombreById(row.Id_marca) },
    { name: 'Talla', selector: 'Id_talla', sortable: true, cell: (row) => getNombreTalla(row.Id_talla) },
    { name: 'Estilo', selector: 'Id_estilo', sortable: true, cell: (row) => mapEstiloIdToNombre(row.Id_estilo) },
    { name: 'Material', selector: 'Id_material', sortable: true, cell: (row) => getMaterialNameById(row.Id_material) },
    { name: 'Diseño', selector: 'Id_diseño', sortable: true, cell: (row) => obtenerNombreDisenoPorId(row.Id_diseño) },
    { name: 'Descuento', selector: 'Descuento', sortable: true },
    { name: 'Descuento_maximo', selector: 'Descuento_maximo', sortable: true },
    { name: 'Bodega', selector: 'Id_bodega', sortable: true, cell: row => bodegaFormatter(row) },
    { name: 'Precio', selector: 'Precio_venta', sortable: true },
    { name: 'Existencias', selector: 'Existencias', sortable: true },
    { name: 'Estado', selector: 'Estado', sortable: true, cell: row => estadoFormatter(row) },
    { name: 'Daños', selector: 'Daños', sortable: true, cell: row => danosFormatter(row) },
    { name: 'Descripcion', selector: 'Descripcion', sortable: true },
    { name: 'Promocion', selector: 'Id_Promocion', sortable: true, cell: row => getDiscountById(row.Id_promocion) },
    {
      name: 'Opciones',
      cell: (row) => (
<Button
  variant="primary"
  style={{ width: '40px', height: '40px', color: 'white' }}
  onClick={() => handleAddToCart(row)}
  disabled={selectedRow === row}>
          <FaPlus />
        </Button>
      ),
      button: true,
    },
  ];


  return (
    <Container fluid style={estilos.containerStyle}>
      <h2 className=" mt-4 center-text" style={estilos.titulo}>
        Registro de Ventas
      </h2>
      <Form style={{ width: '95%', backgroundColor: 'white', marginTop: '10px', marginLeft: '3%', marginRight: 'auto', borderRadius: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Form.Group controlId="formfecha" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '55px' }}>
          <Form.Label style={{ marginLeft: '40px' }}>Fecha de Venta</Form.Label>
          <Form.Control
            type="date"
            className="form-control"
            style={estilos.inputStyle2}
          />
        </Form.Group>
        <Form.Group controlId="formproveedor" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Form.Label style={{ marginLeft: '50px' }}>Cliente</Form.Label>
          <Form.Control
            type="text"
            style={estilos.inputStyle2}
            className="form-control"
          />
        </Form.Group>
      </Form>

      <Button style={estilos.search} variant="outline-secondary" onClick={handleShowModal} >
        Agregar Articulos
      </Button>

    <div style={{ marginTop: '25px', width: '95%', margin: '0 auto', overflowX: 'auto' }} >
    <table style={{ textAlign: 'center',marginTop:'10px' }} className="table table-bordered table-striped"  >
    <thead>
  <tr>
    <th>Artículo</th>
    <th>Categoría</th>
    <th>Marca</th>
    <th>Color</th>
    <th>Estilo</th>
    <th>Material</th>
    <th>Talla</th>
    <th>Diseño</th>
    <th>Existencias</th>
    <th>Cantidad</th>
    <th>Precio</th>
    <th>Subtotal</th>
    <th>Descuento</th>
    <th>Prom Desc%</th>
    <th>Opciones</th>
  </tr>
</thead>
<tbody>
  {selectedItems.map((item) => (
    <tr key={item._id}>
      <td>{getNombreArticulo(item.Id_articulo)}</td>

      <td>{getNombreCategoriaById(item.Id_categoria)}</td>
      <td>{getMarcaNombreById(item.Id_marca)}</td>
      <td>{getColorNameById(item.Id_color)}</td>
      <td>{mapEstiloIdToNombre(item.Id_estilo)}</td>
      <td>{getMaterialNameById(item.Id_material)}</td>
      <td>{getNombreTalla(item.Id_talla)}</td>
      <td>{obtenerNombreDisenoPorId(item.Id_diseño)}</td>
      <td>{item.Existencias}</td>
      <td>{item.cantidad}</td>
      <td>{item.precio}</td>
      <td>{item.subtotal}</td>
      <td>{item.Daños ? 'N/A' : item.descuento}</td>
      <td>{getDiscountById(item.Id_promocion)}</td>
      <td>
        <Button variant="primary" style={{ width: '30px', height: '30px', marginRight: '5px',fontSize:'17px',padding:'0' }}  onClick={() => handleEditOpen(item)}>
          <FaPencilAlt />
        </Button>
        <Button variant="danger" style={{ width: '30px', height: '30px', fontSize: '20px',padding:'0'}}    onClick={() => handleDeleteItem(item._id)}>
          <MdDeleteForever style={{marginBottom:'5px'   }} />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
      </div>

      <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
        <div>
          <Form.Check
            type="checkbox"
            label="Aplicar Descuento"
          />
        </div>

        <div>
          <Form.Check
            type="checkbox"
            label="Aplicar Promocion"
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <h4 id="totalVenta">Total: C$</h4>
          <h5 id="descuentoTotal">Descuento Total: C$</h5>
          <h5>Descuento por Daños: C$</h5>
          <h5>Promoción Descuento Total: C$</h5>
        </div>
      </div>

      <Button variant="success" style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }} onClick={handleRealizarVenta} >
        Realizar Venta
      </Button>
      <Footer />
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Articulos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columns}
            data={tableData}
            pagination
            responsive
            conditionalRowStyles={conditionalRowStyles}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ width: '100px', height: '40px' }} onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={editingItem !== null} onHide={handleEditClose}>
  <Modal.Header closeButton>
    <Modal.Title style={{textAlign:'center'}}>Editar Cantidad</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="formNewQuantity">
      <Form.Label>Cantidad</Form.Label>
      <Form.Control
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" style={{width:'100px',height:'40px'}} onClick={handleEditSave}>
      Guardar
    </Button>
    <Button variant="secondary" style={{width:'100px',height:'40px'}} onClick={handleEditClose}>
      Cancelar
    </Button>
  </Modal.Footer>
</Modal>

      <ToastContainer />
    </Container>
  );
};

export default VentasView;


const conditionalRowStyles = [
  {
    when: row => row.Daños === true,
    style: {
      backgroundColor: '#F64663',
    },
  },
];