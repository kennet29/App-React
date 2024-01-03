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
  const [promociones, setPromociones] = useState([]);


const [applyPromotion, setApplyPromotion] = useState(false);
const [totalPromotionDiscount, setTotalPromotionDiscount] = useState(0);


  const [nombresColores, setNombresColores] = useState([]);
  const [nombresTallas, setNombresTallas] = useState([]);
  const [nombresMarcas, setNombresMarcas] = useState([]);
  const [nombresEstilos, setNombresEstilos] = useState([]);
  const [nombresMateriales, setNombresMateriales] = useState([]);
  const [nombresDiseños, setNombresDiseños] = useState([]);
  const [nombresArticulos, setNombresArticulos] = useState([]);
  const [nombresBodegas, setNombresBodegas] = useState([]);



  const [editedQuantity, setEditedQuantity] = useState(0);
  const [totalDescuento, setTotalDescuento] = useState(0);
  const [selectedPromotionDiscount, setSelectedPromotionDiscount] = useState(0);


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

useEffect(() => {
  const fetchPromociones = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/promociones');
      const promocionesData = response.data;
      setPromociones(promocionesData);
    } catch (error) {
      console.error('Error fetching promociones:', error);
    }
  };

  fetchPromociones();
}, []);

useEffect(() => {
  const fetchBodegas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/bodegas');
      const bodegasData = response.data;
      const nombres = bodegasData.reduce((acc, bodega) => {
        acc[bodega._id] = bodega.nombre;
        return acc;
      }, {});
      setNombresBodegas(nombres);
    } catch (error) {
      console.error('Error fetching bodegas:', error);
    }
  };

  fetchBodegas();
}, []);




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

const getPromocionNameById = (idPromocion) => {
  const promocion = promociones.find((promo) => promo._id === idPromocion);
  return promocion ? promocion.promocion : 'Sin Promo';
};

const getBodegaNameById = (idBodega) => {
  return nombresBodegas[idBodega] || 'Sin Bodega';
};



  const handleEditModal = (row) => {
    setEditItem(row);
    setEditedQuantity(row.Existencias); // Set initial quantity to current value
    // Open the edit modal here
  };

  

 const calculateDiscount = (articulo) => {
  // Assuming the discount percentage is available in the article object
  if (articulo.Daños) {
    return 'C$0.00'; // No aplicar descuento si hay daño
  }
  const discountPercentage = applyDiscount ? (articulo.Descuento || 0) : 0;

  // Calculate the discount amount
  const discountAmount = (articulo.Existencias * articulo.Precio_venta * discountPercentage) / 100;

  // Return the formatted discount amount
  return `C$${discountAmount.toFixed(2)}`;
};

const applyMaxDiscount = (subtotal, descuentoMaximo) => {
  // Lógica para aplicar el descuento máximo, por ejemplo:
  const maxDiscountAmount = (subtotal * descuentoMaximo) / 100;
  return maxDiscountAmount;
};

// Luego, en tu función calculateTotal, donde aplicas descuentos, puedes hacer algo como:
const calculateTotal = () => {
  let totalVenta = 0;
  let totalDescuento = 0;

  articulosSeleccionados.forEach((articulo) => {
    const subtotal = articulo.Existencias * articulo.Precio_venta;

    // Verificar si el checkbox de aplicar descuento está marcado y aplicar descuento máximo
    const discountPercentage = applyDiscount ? (articulo.Descuento || 0) : 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const maxDiscountAmount = applyDiscount ? applyMaxDiscount(subtotal, articulo.Descuento_maximo) : 0;

    totalVenta += subtotal;
    totalDescuento += discountAmount + maxDiscountAmount;
  });

  return (totalVenta - totalDescuento).toFixed(2);
};


 
 const handleEliminarArticulo = (articuloToRemove) => {
  setArticulosSeleccionados((prevArticulos) => {
    const updatedArticulos = prevArticulos.filter((articulo) => articulo._id !== articuloToRemove._id);

  
    const updatedDescuentoTotal = updatedArticulos.reduce((total, articulo) => {
      const descuento = articulo.Descuento || 0;
      const descuentoAmount = (articulo.Existencias * articulo.Precio_venta * descuento) / 100;
      return total + descuentoAmount;
    }, 0);

    setTotalDescuento(updatedDescuentoTotal);

    return updatedArticulos;
  });
};


useEffect(() => {
  const descuentoTotal = articulosSeleccionados.reduce((total, articulo) => {
    const descuento = applyDiscount ? (articulo.Descuento || 0) : 0;
    const descuentoAmount = (articulo.Existencias * articulo.Precio_venta * descuento) / 100;
    const promotionDiscount = applyPromotion ? calculatePromotionDiscount(articulo) : 0;
    return total + descuentoAmount + promotionDiscount;
  }, 0);

  setTotalDescuento(descuentoTotal);

  const totalPromoDiscount = applyPromotion
    ? articulosSeleccionados.reduce((total, articulo) => total + calculatePromotionDiscount(articulo), 0)
    : 0;

  setTotalPromotionDiscount(totalPromoDiscount);
}, [articulosSeleccionados, applyDiscount, applyPromotion]);
  
  
  const handleSaveEdit = () => {
    
    if (editedQuantity > editItem.Existencias) {
      toast.error('No hay Stock suficiente',{ position: toast.POSITION.TOP_CENTER });
      return;
    }

    setArticulosSeleccionados((prev) =>
      prev.map((item) =>
        item.Id_articulo === editItem.Id_articulo
          ? { ...item, Existencias: editedQuantity }
          : item
      )
    );
    setEditItem(null);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
   
        const categoriasResponse = await axios.get('http://localhost:4000/api/categorias');
        const categoriasData = categoriasResponse.data;
        setCategorias(categoriasData);

        const stockResponse = await axios.get('http://localhost:4000/api/stock/');
        const stockData = stockResponse.data;

        const updatedData = await Promise.all(
          stockData.map(async (item) => {
            const articuloResponse = await axios.get(`http://localhost:4000/api/articulos/${item.Id_articulo}`);
            const articuloData = articuloResponse.data;

            const categoria = categoriasData.find((cat) => cat._id === articuloData.categoria);

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

  const getPromocionDiscountPercentage = (idPromocion) => {
    const promocion = promociones.find((promo) => promo._id === idPromocion);
    return promocion ? `${promocion.descuento}%` : 'Sin Promocion';
  };
  


  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAgregarArticulo = (row) => {
    if (isArticuloAlreadySelected(row)) {
      toast.warning('El artículo ya está en la lista', { position: toast.POSITION.TOP_CENTER });
      return;
    }
    const promotionDiscount = row.Id_promocion ? getPromocionDiscountPercentage(row.Id_promocion) : 0;
    setSelectedPromotionDiscount(promotionDiscount);
    setArticulosSeleccionados([...articulosSeleccionados, row]);
  };

  const handleDiscountChange = (type) => {
    if (type === 'discount') {
      setApplyDiscount(!applyDiscount);
    } else if (type === 'promotion') {
      setApplyPromotion(!applyPromotion);
    }
  };
  
 
  const calculatePromotionDiscount = (articulo) => {
    if (!applyPromotion || !articulo.Id_promocion) {
      return 0;
    }
    const promocion = promociones.find((promo) => promo._id === articulo.Id_promocion);
    if (!promocion) {
      return 0;
    }
    const discountAmount = (articulo.Existencias * articulo.Precio_venta * promocion.descuento) / 100;
    return discountAmount;
  };
  
 
  useEffect(() => {
    const descuentoTotal = articulosSeleccionados.reduce((total, articulo) => {
      const descuento = applyDiscount ? (articulo.Descuento || 0) : 0;
      const descuentoAmount = (articulo.Existencias * articulo.Precio_venta * descuento) / 100;
      const promotionDiscount = calculatePromotionDiscount(articulo);
      return total + descuentoAmount + promotionDiscount;
    }, 0);
  
    setTotalDescuento(descuentoTotal);
  
    const totalPromoDiscount = articulosSeleccionados.reduce((total, articulo) => {
      return total + calculatePromotionDiscount(articulo);
    }, 0);
    setTotalPromotionDiscount(totalPromoDiscount);
  }, [articulosSeleccionados, applyDiscount, applyPromotion]);
  

  useEffect(() => {
    const descuentoTotal = articulosSeleccionados.reduce((total, articulo) => {
      const descuento = applyDiscount ? (articulo.Descuento || 0) : 0;
      const descuentoAmount = (articulo.Existencias * articulo.Precio_venta * descuento) / 100;
      const promotionDiscount = calculatePromotionDiscount(articulo);
      return total + descuentoAmount + promotionDiscount;
    }, 0);
  
    setTotalDescuento(descuentoTotal);
  
    const totalPromoDiscount = articulosSeleccionados.reduce((total, articulo) => {
      return total + calculatePromotionDiscount(articulo);
    }, 0);
  
    setTotalPromotionDiscount(totalPromoDiscount);
  }, [articulosSeleccionados, applyDiscount, applyPromotion]);
  

  const construirTablaPersonalizada = () => {
    if (articulosSeleccionados.length === 0) {
      return null;
    }

 
    return (
<Container style={{marginTop: '10px',   overflowX: 'auto',overflowY:'auto',fontFamily:'Bold'}} >
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
            <th>Desc. Promo (%)</th>
            <th>Subtotal</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {articulosSeleccionados.map((articulo) => (
            <tr key={articulo._id}>
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
              <td>{getPromocionDiscountPercentage(articulo.Id_promocion)}</td>
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
                  style={{ width: '40px', height: '40px',marginTop:'2px' }}
                  onClick={() => handleEliminarArticulo(articulo)}
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
      cell: (row) => getColorNameById(row.Id_color), 
    },
    { name: 'Marca', 
      selector: 'Id_marca', 
      sortable: true,
      cell: (row) => getMarcaNameById(row.Id_marca), 
    },
    { name: 'Talla', 
      selector: 'Id_talla', 
      sortable: true,
      cell: (row) => getTallaNameById(row.Id_talla), 
    },
    { name: 'Estilo', 
      selector: 'Id_estilo', 
      sortable: true,
      cell: (row) => getEstiloNameById(row.Id_estilo), 
    },
    { name: 'Material', 
      selector: 'Id_material', 
      sortable: true,
      cell: (row) => getMaterialNameById(row.Id_material), 
    },
    { name: 'Diseño', 
      selector: 'Id_diseño', 
      sortable: true,
      cell: (row) => getDiseñoNameById(row.Id_diseño), 
    },
    { name: 'Precio', selector: 'Precio_venta', sortable: true },

    {name:'Descuento %',selector:'Descuento',sortable:true},

    { name: 'Existencias', selector: 'Existencias', sortable: true },

    { name: 'Daño', selector: 'Daños', cell: (row) => (row.Daños ? 'Sí' : 'No') },

    { name: 'Desc Max %', selector: 'Descuento_maximo', sortable: true, cell: (row) => (row.Descuento_maximo ? `${row.Descuento_maximo}%` : 'N/A') },



    { 
      name: 'Bodega', 
      selector: 'Id_bodega', 
      sortable: true,
      cell: (row) => getBodegaNameById(row.Id_bodega),
    },

     { name: 'Promocion', selector: 'Id_promocion', sortable: true, cell: (row) => getPromocionNameById(row.Id_promocion) },

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
            style={{ overflowX: 'auto',overflowY:'auto',textAlign:'center',width:'100%' }}
          />
        </Modal.Body>
      </Modal>

      <div style={{ marginTop: '20px', width:'95' }}>
        <h3 style={{color:'white',textAlign:'center'}} >Artículos Seleccionados</h3>
        {construirTablaPersonalizada()}
      </div>


      <div style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
      <div>
  <Form.Check
    type="checkbox"
    label="Aplicar Descuento"
    checked={applyDiscount}
    onChange={() => handleDiscountChange('discount')}
  />
</div>

<div>
  <Form.Check
    type="checkbox"
    label="Aplicar Promocion"
    checked={applyPromotion}
    onChange={() => handleDiscountChange('promotion')}
  />
</div>

<div style={{ marginTop: '10px' }}>
  <h4>Total: ${calculateTotal()}</h4>
  <h5>Descuento Total: C${totalDescuento.toFixed(2)}</h5>
  <h5>Promoción Descuento Total: C${totalPromotionDiscount.toFixed(2)}</h5>
</div>
</div>


      <Button variant="success" style={{ width: '150px', height: '50px', marginTop: '20px', marginLeft: '45%' }}>
        Realizar Venta
      </Button>

      <Footer />

      <Modal show={!!editItem} onHide={() => setEditItem(null)}>
      <Modal.Header style={{backgroundColor:'#4a4a4a',color:'white'}} closeButton>
        <Modal.Title>Editar Cantidad</Modal.Title>
      </Modal.Header  >
      <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>
        <Form.Group >
          <Form.Label >Cantidad:</Form.Label>
          <Form.Control
            type="number"
            value={editedQuantity}
              onChange={handleQuantityChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
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
