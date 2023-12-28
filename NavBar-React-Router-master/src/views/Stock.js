import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import {  FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StockView = () => {
  const [stock, setStock] = useState([]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [colores, setColores] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [tiposDeEstilo, setTiposDeEstilo] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [disenos, setDisenos] = useState([]);
  const [promociones, setPromociones] = useState([]);

  const [newItem, setNewItem] = useState({
    Id_articulo: '',
    Id_usuario: '',
    Id_color: '',
    Id_marca: '',
    Id_talla: '',
    Id_estilo: '',
    Id_material: '',
    Id_diseño: '',
    Descuento: 0,
    Descuento_maximo: 0,
    Precio_prov: 0,
    Precio_venta: 0,
    Estado: true,
    Daños: false,
    Descripcion: '',
    Id_ingreso: '',
    Cod_barra: 0,
    Id_promocion: null,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = () => {
    
    setShowUpdateModal(false);
    setNewItem({
      Id_articulo: '',
      Id_usuario: '',
      Id_color: '',
      Id_marca: '',
      Id_talla: '',
      Id_estilo: '',
      Id_material: '',
      Id_diseño: '',
      Descuento: 0,
      Descuento_maximo: 0,
      Precio_prov: 0,
      Precio_venta: 0,
      Estado: true,
      Daños: false,
      Descripcion: '',
      Id_ingreso: '',
      Cod_barra: 0,
      Id_promocion: null,
    });
    setSelectedItem(null);
  };

  const handleNotification = () => {
    toast.success('Operation successful', { position: toast.POSITION.TOP_CENTER });
  };



  const handleUpdate = (itemId) => {
    const selected = stock.find((item) => item._id === itemId);
    setSelectedItem(selected);
    setShowUpdateModal(true);
  };



 const showData = async () => {
  try {
  const marcasResponse = await fetch('http://localhost:4000/api/marcas/');
  const marcasData = await marcasResponse.json();
  setMarcas(marcasData);
  
  const articulosResponse = await fetch('http://localhost:4000/api/articulos');
  const articulosData = await articulosResponse.json();
  setArticulos(articulosData);

  const coloresResponse = await fetch('http://localhost:4000/api/colores');
  const coloresData = await coloresResponse.json();
  setColores(coloresData);

  const tallasResponse = await fetch('http://localhost:4000/api/tallas/');
  const tallasData = await tallasResponse.json();
  setTallas(tallasData);

  const materialesResponse = await fetch('http://localhost:4000/api/materiales');
  const materialesData = await materialesResponse.json();
  setMateriales(materialesData);


  const tiposDeEstiloResponse = await fetch('http://localhost:4000/api/estilos/');
  const tiposDeEstiloData = await tiposDeEstiloResponse.json();
  setTiposDeEstilo(tiposDeEstiloData);

  const disenosResponse = await fetch('http://localhost:4000/api/disenos');
  const disenosData = await disenosResponse.json();
  setDisenos(disenosData);

  const promocionesResponse = await fetch('http://localhost:4000/api/promociones');
  const promocionesData = await promocionesResponse.json();
  setPromociones(promocionesData);
    

    const response = await fetch('http://localhost:4000/api/stock/');
    const data = await response.json();
    setStock(data);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  const columns = [
 {
  name: 'Articulo',
  selector: (row) => {
    const articulo = articulos.find((articulo) => articulo._id === row.Id_articulo);
    return articulo ? articulo.nombre : '';
  },
  sortable: true,
  center: true,
},

    {
      name: 'ID Usuario',
      selector: (row) => row.Id_usuario,
      sortable: true,
      center: true,
    },
   {
  name: 'Color',
  selector: (row) => {
    const color = colores.find((color) => color._id === row.Id_color);
    return color ? color.color : '';
  },
  sortable: true,
  center: true,
},
  {
  name: 'Marca',
  selector: (row) => {
    const marca = marcas.find((marca) => marca._id === row.Id_marca);
    return marca ? marca.marca : '';
  },
  sortable: true,
  center: true,
},

   {
  name: 'Talla',
  selector: (row) => {
    const talla = tallas.find((talla) => talla._id === row.Id_talla);
    return talla ? talla.talla : '';
  },
  sortable: true,
  center: true,
},
{
  name: 'Tipo de Estilo',
  selector: (row) => {
    const tipoDeEstilo = tiposDeEstilo.find((tipoDeEstilo) => tipoDeEstilo._id === row.Id_estilo);
    return tipoDeEstilo ? tipoDeEstilo.estilo : '';
  },
  sortable: true,
  center: true,
},

{
  name: 'Material',
  selector: (row) => {
    const material = materiales.find((material) => material._id === row.Id_material);
    return material ? material.material : '';
  },
  sortable: true,
  center: true,
},
{
  name: 'Diseño',
  selector: (row) => {
    const diseno = disenos.find((diseno) => diseno._id === row.Id_diseño);
    return diseno ? diseno.diseno : '';
  },
  sortable: true,
  center: true,
},
    {
      name: 'Descuento',
      selector: (row) => row.Descuento,
      sortable: true,
      center: true,
    },
    {
      name: 'Descuento Máximo',
      selector: (row) => row.Descuento_maximo,
      sortable: true,
      center: true,
    },
    {
      name: 'Precio Prov',
      selector: (row) => row.Precio_prov,
      sortable: true,
      center: true,
    },
    {
      name: 'Precio Venta',
      selector: (row) => row.Precio_venta.toFixed(2),
      sortable: true,
      center: true,
    },
    {
      name: 'Estado',
      selector: (row) => (row.Estado ? 'Activo' : 'Descontinuado'),
      sortable: true,
      center: true,
    },
    {
      name: 'Daños',
      selector: (row) => (row.Daños ? 'SI' : 'NO'),
      sortable: true,
      center: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.Descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'ID Ingreso',
      selector: (row) => row.Id_ingreso,
      sortable: true,
      center: true,
    },
    {
      name: 'Código de Barras',
      selector: (row) => row.Cod_barra,
      sortable: true,
      center: true,
    },
    {
      name: 'Promoción',
      selector: (row) => {
        const promocion = promociones.find((promocion) => promocion._id === row.Id_promocion);
        return promocion ? promocion.promocion : '';
      },
      sortable: true,
      center: true,
    },    
    {
      name: 'Acciones',
      cell: (row) => (
        <div>
          <Styles.ActionButton onClick={() => handleUpdate(row._id)} update>
            <FaEdit />
          </Styles.ActionButton>
        </div>
      ),
      center: true,
    },
  ];
  

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search by Item ID"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  

  

  const handleUpdateSubmit = async () => {
    try {
      if (!selectedItem || !selectedItem._id) {
        console.error('No item selected for update');
        return;
      }
  
      // Construye la URL con el ID del elemento seleccionado
      const urlWithId = `http://localhost:4000/api/stock/${selectedItem._id}`;
  
      // Realiza la solicitud POST al servidor con los datos actualizados
      const response = await fetch(urlWithId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedItem), // Envia los datos actualizados en el cuerpo de la solicitud
      });
  
      // Verifica si la solicitud fue exitosa (código 2xx)
      if (response.ok) {
        // Realiza alguna acción adicional si es necesario
        handleNotification();
        handleClose(); // Cierra el modal después de la actualización exitosa
      } else {
        // Maneja errores si la solicitud no fue exitosa
        console.error('Error updating item:', response.statusText);
        // Puedes mostrar un mensaje de error al usuario si es necesario
      }
    } catch (error) {
      console.error('Error updating item:', error);
      // Puedes mostrar un mensaje de error al usuario si es necesario
    }
  };
  

  useEffect(() => {
    showData();
  }, []);

  return (
    <Styles.AppContainer>
      <Navbar />
     

      <Styles.StyledDataTable
        columns={columns}
        data={stock}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />


<Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Update Item</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>

    <Form.Group controlId="formIdArticulo">
  <Form.Label>Artículo</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_articulo : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_articulo: e.target.value,
      })
    }
  >
    <option value="">Selecciona un artículo</option>
    {articulos.map((articulo) => (
      <option key={articulo._id} value={articulo._id}>
        {articulo.nombre}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group controlId="formIdColor">
  <Form.Label>Color</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_color : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_color: e.target.value,
      })
    }
  >
    <option value="">Selecciona un color</option>
    {colores.map((color) => (
      <option key={color._id} value={color._id}>
        {color.color}
      </option>
    ))}
  </Form.Control>
</Form.Group>

<Form.Group controlId="formIdMarca">
  <Form.Label>Marca</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_marca : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_marca: e.target.value,
      })
    }
  >
    <option value="">Selecciona una marca</option>
    {marcas.map((marca) => (
      <option key={marca._id} value={marca._id}>
        {marca.marca}
      </option>
    ))}
  </Form.Control>
</Form.Group>



<Form.Group controlId="formIdTalla">
  <Form.Label>Talla</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_talla : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_talla: e.target.value,
      })
    }
  >
    <option value="">Selecciona una talla</option>
    {tallas.map((talla) => (
      <option key={talla._id} value={talla._id}>
        {talla.talla}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group controlId="formIdEstilo">
  <Form.Label>Estilo</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_estilo : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_estilo: e.target.value,
      })
    }
  >
    <option value="">Selecciona un estilo</option>
    {tiposDeEstilo.map((estilo) => (
      <option key={estilo._id} value={estilo._id}>
        {estilo.estilo}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group controlId="formIdMaterial">
  <Form.Label>Material</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_material : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_material: e.target.value,
      })
    }
  >
    <option value="">Selecciona un material</option>
    {materiales.map((material) => (
      <option key={material._id} value={material._id}>
        {material.material}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group controlId="formIdDiseno">
  <Form.Label>Diseño</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_diseno : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_diseno: e.target.value,
      })
    }
  >
    <option value="">Selecciona un diseño</option>
    {disenos.map((diseno) => (
      <option key={diseno._id} value={diseno._id}>
        {diseno.diseno}
      </option>
    ))}
  </Form.Control>
</Form.Group>


<Form.Group controlId="formDescuento">
  <Form.Label>Descuento</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Descuento"
    value={selectedItem ? selectedItem.Descuento : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descuento: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formDescuentoMaximo">
  <Form.Label>Descuento Máximo</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Descuento Máximo"
    value={selectedItem ? selectedItem.Descuento_maximo : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descuento_maximo: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formPrecioProveedor">
  <Form.Label>Precio Proveedor</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Precio Proveedor"
    value={selectedItem ? selectedItem.Precio_prov : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Precio_prov: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formPrecioVenta">
  <Form.Label>Precio Venta</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Precio Venta"
    value={selectedItem ? selectedItem.Precio_venta : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Precio_venta: e.target.value,
      })
    }
  />
</Form.Group>
<Form.Group controlId="formEstado">
  <Form.Label>Estado</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Estado : true}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Estado: e.target.value,
      })
    }
  >
    <option value={true}>Active</option>
    <option value={false}>Inactive</option>
  </Form.Control>
</Form.Group>
<Form.Group controlId="formDanos">
  <Form.Label>Daños</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Daños : false}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Daños: e.target.value,
      })
    }
  >
    <option value={false}>No</option>
    <option value={true}>Yes</option>
  </Form.Control>
</Form.Group>
<Form.Group controlId="formDescripcion">
  <Form.Label>Descripción Daños</Form.Label>
  <Form.Control
    type="text"
    placeholder="Descripción"
    value={selectedItem ? selectedItem.Descripcion : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Descripcion: e.target.value,
      })
    }
  />
</Form.Group>

<Form.Group controlId="formCodBarra">
  <Form.Label>Código de Barras</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter Código de Barras"
    value={selectedItem ? selectedItem.Cod_barra : 0}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Cod_barra: e.target.value,
      })
    }
  />
</Form.Group>

<Form.Group controlId="formIdPromocion">
  <Form.Label>Promoción</Form.Label>
  <Form.Control
    as="select"
    value={selectedItem ? selectedItem.Id_promocion : ''}
    onChange={(e) =>
      setSelectedItem({
        ...selectedItem,
        Id_promocion: e.target.value,
      })
    }
  >
    <option value="">Selecciona una promoción</option>
    {promociones.map((promocion) => (
      <option key={promocion._id} value={promocion._id}>
        {promocion.promocion}
      </option>
    ))}
  </Form.Control>
</Form.Group>


    </Form>
  </Modal.Body>
  <Styles.ModalFooter>
    <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
      Save Changes
    </Button>
    <Button className="otros" variant="secondary" onClick={handleClose}>
      Close
    </Button>
  </Styles.ModalFooter>
</Styles.StyledModal>

<Footer />
<ToastContainer />
</Styles.AppContainer>
);
  }
export default StockView;
