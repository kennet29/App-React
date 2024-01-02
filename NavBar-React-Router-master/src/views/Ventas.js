import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal, Toast } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import estilos from '../css/ingresos-estilos';
import '../css/detalle-ingresos.css';
import Footer from '../component/footer/footer';
import { FaPlus,FaPencilAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDeleteForever } from "react-icons/md";


const VentasView = () => {
  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [newQuantity, setNewQuantity] = useState(''); 
  const [editItem, setEditItem] = useState(null);
  const [applyDiscount, setApplyDiscount] = useState(false);
  

  const [nombresColores, setNombresColores] = useState([]);
  const [nombresTallas, setNombresTallas] = useState([]);
  const [nombresMarcas, setNombresMarcas] = useState([]);
  const [nombresEstilos, setNombresEstilos] = useState([]);
  const [nombresMateriales, setNombresMateriales] = useState([]);
  const [nombresDiseños, setNombresDiseños] = useState([]);
  const [nombresArticulos, setNombresArticulos] = useState([]);



  const [editedQuantity, setEditedQuantity] = useState(0);
  const [totalDescuento, setTotalDescuento] = useState(0);

  useEffect(() => {
    // Actualizar el total de descuentos cada vez que cambia la lista de artículos seleccionados
    const descuentoTotal = articulosSeleccionados.reduce((total, articulo) => {
      // Asumiendo que el descuento está en porcentaje
      const descuento = articulo.Descuento || 0;
      const descuentoAmount = (articulo.Existencias * articulo.Precio_venta * descuento) / 100;
      return total + descuentoAmount;
    }, 0);

    setTotalDescuento(descuentoTotal);
  }, [articulosSeleccionados]);


  const isArticuloAlreadySelected = (nuevoArticulo) => {
    return articulosSeleccionados.some((articulo) => {
      // Comparar los campos relevantes para evitar duplicados
      return (
        articulo.Id_articulo === nuevoArticulo.Id_articulo &&
        articulo.Id_color === nuevoArticulo.Id_color &&
        articulo.Id_marca === nuevoArticulo.Id_marca &&
        articulo.Id_talla === nuevoArticulo.Id_talla &&
        articulo.Id_estilo === nuevoArticulo.Id_estilo &&
        articulo.Id_material === nuevoArticulo.Id_material &&
        articulo.Id_diseño === nuevoArticulo.Id_diseño
        // Agregar más comparaciones según sea necesario
      );
    });
  };


  useEffect(() => {
  const fetchDiseños = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/disenos');
      const diseñosData = response.data;
      // Crear la lista de nombres de diseños
      const nombres = diseñosData.reduce((acc, diseño) => {
        acc[diseño._id] = diseño.diseno;
        return acc;
      }, {});
      setNombresDiseños(nombres);
    } catch (error) {
      console.error('Error fetching diseños:', error);
    }
  };

  fetchDiseños();
}, []);


useEffect(() => {
  const fetchTallas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tallas');
      const tallasData = response.data;
      // Crear la lista de nombres de tallas
      const nombres = tallasData.reduce((acc, talla) => {
        acc[talla._id] = talla.talla;
        return acc;
      }, {});
      setNombresTallas(nombres);
    } catch (error) {
      console.error('Error fetching tallas:', error);
    }
  };

  fetchTallas();
}, []);

useEffect(() => {
  const fetchArticulos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/articulos');
      const articulosData = response.data;
      // Crear la lista de nombres de artículos
      const nombres = articulosData.reduce((acc, articulo) => {
        acc[articulo._id] = articulo.nombre;
        return acc;
      }, {});
      setNombresArticulos(nombres);
    } catch (error) {
      console.error('Error fetching artículos:', error);
    }
  };

  fetchArticulos();
}, []);


useEffect(() => {
  const fetchMateriales = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/materiales');
      const materialesData = response.data;
      // Crear la lista de nombres de materiales
      const nombres = materialesData.reduce((acc, material) => {
        acc[material._id] = material.material;
        return acc;
      }, {});
      setNombresMateriales(nombres);
    } catch (error) {
      console.error('Error fetching materiales:', error);
    }
  };

  fetchMateriales();
}, []);


useEffect(() => {
  const fetchMarcas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/marcas');
      const marcasData = response.data;
      // Crear la lista de nombres de marcas
      const nombres = marcasData.reduce((acc, marca) => {
        acc[marca._id] = marca.marca;
        return acc;
      }, {});
      setNombresMarcas(nombres);
    } catch (error) {
      console.error('Error fetching marcas:', error);
    }
  };

  fetchMarcas();
}, []);



  useEffect(() => {
    const fetchColores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/colores');
        const coloresData = response.data;
    
        const nombres = coloresData.reduce((acc, color) => {
          acc[color._id] = color.color;
          return acc;
        }, {});
        setNombresColores(nombres);
      } catch (error) {
        console.error('Error fetching colores:', error);
      }
    };
  
    fetchColores();
  }, []);

  useEffect(() => {
    const fetchEstilos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/estilos');
        const estilosData = response.data;
        // Crear la lista de nombres de estilos
        const nombres = estilosData.reduce((acc, estilo) => {
          acc[estilo._id] = estilo.estilo;
          return acc;
        }, {});
        setNombresEstilos(nombres);
      } catch (error) {
        console.error('Error fetching estilos:', error);
      }
    };
  
    fetchEstilos();
  }, []);
  
  

  const getColorNameById = (idColor) => {
    return nombresColores[idColor] || 'Desconocido';
  };
  
  const getTallaNameById = (idTalla) => {
    return nombresTallas[idTalla] || 'Desconocido';
  };
  
  const getMarcaNameById = (idMarca) => {
    return nombresMarcas[idMarca] || 'Desconocido';
  };
  
  const getEstiloNameById = (idEstilo) => {
    return nombresEstilos[idEstilo] || 'Desconocido';
  };

  const getMaterialNameById = (idMaterial) => {
    return nombresMateriales[idMaterial] || 'Desconocido';
  };
  

  const getDiseñoNameById = (idDiseño) => {
  return nombresDiseños[idDiseño] || 'Desconocido';
};

const getArticuloNameById = (idArticulo) => {
  return nombresArticulos[idArticulo] || 'Desconocido';
};


  const handleEditModal = (row) => {
    setEditItem(row);
    setEditedQuantity(row.Existencias); // Set initial quantity to current value
    // Open the edit modal here
  };

  

  const calculateDiscount = (articulo) => {
    // Assuming the discount percentage is available in the article object
    const discountPercentage = articulo.Descuento || 0;
  
    // Calculate the discount amount
    const discountAmount = (articulo.Existencias * articulo.Precio_venta * discountPercentage) / 100;
  
    // Return the formatted discount amount
    return `$${discountAmount.toFixed(2)}`;
  };

  const calculateTotal = () => {
    let totalVenta = 0;
    let totalDescuento = 0;
  
    articulosSeleccionados.forEach((articulo) => {
      const subtotal = articulo.Existencias * articulo.Precio_venta;
  
      // Solo calcula el descuento si applyDiscount es true y el artículo tiene descuento
      const discountAmount = applyDiscount && articulo.Descuento
        ? (subtotal * articulo.Descuento) / 100
        : 0;
  
      totalVenta += subtotal;
      totalDescuento += discountAmount;
    });
  
    return (totalVenta - totalDescuento).toFixed(2);
  };
  
  const handleEliminarArticulo = (idArticulo) => {
    // Filter out the selected article to remove it from the state
    const updatedArticulos = articulosSeleccionados.filter((articulo) => articulo.Id_articulo !== idArticulo);
    setArticulosSeleccionados(updatedArticulos);
  };

  const handleDiscountChange = () => {
    setApplyDiscount(!applyDiscount);
  };
  

  const handleSaveEdit = () => {
    // Validar que la cantidad editada no sea mayor que Existencias
    if (editedQuantity > editItem.Existencias) {
      // Mostrar un mensaje de error o tomar la acción necesaria
      toast.error('No hay Stock suficiente',{ position: toast.POSITION.TOP_CENTER });
      // Puedes agregar un mensaje de error o usar una biblioteca para manejar notificaciones
      return;
    }
  
    // Update the quantity in your state
    setArticulosSeleccionados((prev) =>
      prev.map((item) =>
        item.Id_articulo === editItem.Id_articulo
          ? { ...item, Existencias: editedQuantity }
          : item
      )
    );
    // Close the edit modal
    setEditItem(null);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de categorías
        const categoriasResponse = await axios.get('http://localhost:4000/api/categorias');
        const categoriasData = categoriasResponse.data;
        setCategorias(categoriasData);

        // Obtener datos de stock
        const stockResponse = await axios.get('http://localhost:4000/api/stock/');
        const stockData = stockResponse.data;

        // Actualizar datos con nombres de categorías
        const updatedData = await Promise.all(
          stockData.map(async (item) => {
            const articuloResponse = await axios.get(`http://localhost:4000/api/articulos/${item.Id_articulo}`);
            const articuloData = articuloResponse.data;

            // Buscar el nombre de la categoría correspondiente
            const categoria = categoriasData.find((cat) => cat._id === articuloData.categoria);

            // Agregar la nueva propiedad 'nombre_categoria'
            return {
              ...item,
              nombre_categoria: categoria ? categoria.categoria : 'Desconocida',
            };
          })
        );

        setData(updatedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) || value === '') {
      setEditedQuantity(value);
    }
  };


  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAgregarArticulo = (row) => {
    // Verificar si el artículo ya está en la lista
    if (isArticuloAlreadySelected(row)) {
      // Mostrar un mensaje o tomar la acción necesaria
      toast.warning('El artículo ya está en la lista', { position: toast.POSITION.TOP_CENTER });
      return;
    }
  
    setArticulosSeleccionados([...articulosSeleccionados, row]);
  };
  
  // Función para construir y personalizar la tabla fuera del modal
  const construirTablaPersonalizada = () => {
    if (articulosSeleccionados.length === 0) {
      return null;
    }

    return (
<Container style={{marginTop: '10px', width: '100%', marginLeft: '5%', overflowX: 'auto',fontFamily:'Bold'}} >
<table style={{ textAlign: 'center', fontFamily: 'Arial' }} className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Categoría</th>
            <th>Color</th>
            <th>Marca</th>
            <th>Talla</th>
            <th>Estilo</th>
            <th>Material</th>
            <th>Diseño</th>
            <th>Precio </th>
            <th>Cantidad</th>
            <th>Descuento</th>
            <th>Subtotal</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {articulosSeleccionados.map((articulo) => (
            <tr key={articulo.Id_articulo}>
              <td>{getArticuloNameById(articulo.Id_articulo)}</td>

              <td>{articulo.nombre_categoria}</td>
              <td>{getColorNameById(articulo.Id_color)}</td>

              <td>{getMarcaNameById(articulo.Id_marca)}</td>

              <td>{getTallaNameById(articulo.Id_talla)}</td>

              <td>{getEstiloNameById(articulo.Id_estilo)}</td>

              <td>{getMaterialNameById(articulo.Id_material)}</td>

             <td>{getDiseñoNameById(articulo.Id_diseño)}</td>

              <td>{articulo.Precio_venta}</td>
              <td> {articulo.Existencias}</td>
              <td>{calculateDiscount(articulo)}</td>
              <td>${(articulo.Existencias * articulo.Precio_venta).toFixed(2)}</td>

              <td>
              <Button
                variant="outline-primary"
                style={{ width: '40px', height: '40px',marginRight:'2px' }}
                onClick={() => handleEditModal(articulo)}
              >
                <FaPencilAlt />
              </Button>

             
                <Button
                  variant="outline-danger"
                  style={{ width: '40px', height: '40px' }}
                  onClick={() => handleEliminarArticulo(articulo.Id_articulo)}
                >
                  <MdDeleteForever style={{}} />

                </Button>
              
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      </Container>
    );
  };

  const columns = [
    { 
      name: 'Artículo', 
      selector: 'Id_articulo', 
      sortable: true, 
      cell: (row) => getArticuloNameById(row.Id_articulo), 
    },
    { name: 'Categoría', selector: 'nombre_categoria', sortable: true, label: 'Categoría' },
    { name: 'Color', 
      selector: 'Id_color', 
      sortable: true,
      cell: (row) => getColorNameById(row.Id_color), // Aplicar función para obtener el nombre del color
    },
    { name: 'Marca', 
      selector: 'Id_marca', 
      sortable: true,
      cell: (row) => getMarcaNameById(row.Id_marca), // Aplicar función para obtener el nombre de la marca
    },
    { name: 'Talla', 
      selector: 'Id_talla', 
      sortable: true,
      cell: (row) => getTallaNameById(row.Id_talla), // Aplicar función para obtener el nombre de la talla
    },
    { name: 'Estilo', 
      selector: 'Id_estilo', 
      sortable: true,
      cell: (row) => getEstiloNameById(row.Id_estilo), // Aplicar función para obtener el nombre del estilo
    },
    { name: 'Material', 
      selector: 'Id_material', 
      sortable: true,
      cell: (row) => getMaterialNameById(row.Id_material), // Aplicar función para obtener el nombre del material
    },
    { name: 'Diseño', 
      selector: 'Id_diseño', 
      sortable: true,
      cell: (row) => getDiseñoNameById(row.Id_diseño), // Aplicar función para obtener el nombre del diseño
    },
    { name: 'Precio', selector: 'Precio_venta', sortable: true },

    {name:'Descuento %',selector:'Descuento',sortable:true},

    { name: 'Existencias', selector: 'Existencias', sortable: true },
    {
      name: 'Opciones',
      cell: (row) => (
        <Button variant="outline-primary" style={{ width: '40px', height: '40px' }} onClick={() => handleAgregarArticulo(row)}>
          <FaPlus />
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
      <Button style={estilos.search} variant="outline-secondary" onClick={handleShowModal}>
        Agregar Articulos
      </Button>

      <Modal show={showModal}  onHide={handleCloseModal} size="xl">
        <Modal.Header style={{color:'white',backgroundColor:'#4a4a4a'}}  closeButton>
          <Modal.Title  >Inventario</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{color:'white',backgroundColor:'#4a4a4a'}}>
          <DataTable
           
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
            responsive
            style={{ overflowX: 'auto',overflowY:'auto',textAlign:'center' }}
          />
        </Modal.Body>
      </Modal>

      <div style={{ marginTop: '20px', marginLeft: '3%' }}>
        <h3 style={{color:'white',textAlign:'center'}} >Artículos Seleccionados</h3>
        {construirTablaPersonalizada()}
      </div>


      <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
  <div>
    <Form.Check
      type="checkbox"
      label="Aplicar Descuento"
      checked={applyDiscount}
      onChange={handleDiscountChange}
    />
  </div>

  <div>
    <Form.Check
      type="checkbox"
      label="Aplicar Promocion"
    
      
    />
  </div>
  <div style={{ marginTop: '10px' }}>
    <h4>Total: ${calculateTotal()}</h4>
    <h5>Descuento Total: ${totalDescuento.toFixed(2)}</h5>

  </div>
</div>


      <Button variant="success" style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }}>
        Realizar Venta
      </Button>

      <Footer />

      <Modal show={!!editItem} onHide={() => setEditItem(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cantidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Cantidad:</Form.Label>
          <Form.Control
            type="number"
            value={editedQuantity}
              onChange={handleQuantityChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
      <Button style={{width:'100px',height:'50px'}}  variant="primary" onClick={handleSaveEdit}>
          Guardar
        </Button>
        <Button style={{width:'100px',height:'50px'}} variant="secondary" onClick={() => setEditItem(null)}>
          Cancelar
        </Button>
        
      </Modal.Footer>
    </Modal>
    <ToastContainer />
    </Container>
  );
};

export default VentasView;
