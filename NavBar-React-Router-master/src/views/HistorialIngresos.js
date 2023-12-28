import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import {FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistorialIngresosView = () => {
  const [ingresos, setIngresos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newIngreso, setNewIngreso] = useState({
    id_usuario: '',
    id_proveedor: '',
    fecha: '',
    iva: 0,
    descuento: 0,
    subtotal: 0,
    total: 0,
  });
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewIngreso({
      id_usuario: '',
      id_proveedor: '',
      fecha: '',
      iva: 0,
      descuento: 0,
      subtotal: 0,
      total: 0,
    });
    setSelectedIngreso(null);
  };

  const getNameById = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/proveedores/${id}`);
      const data = await response.json();
      return data.nombre || 'Proveedor no encontrado'; // O un valor predeterminado
    } catch (error) {
      console.error('Error fetching name by ID:', error);
      return 'Proveedor no encontrado'; // O un valor predeterminado
    }
  };

  const handleNotificacion = () => {
    toast.success('Operación exitosa', { position: toast.POSITION.TOP_CENTER });
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (ingresoId) => {
    const selected = ingresos.find((ingreso) => ingreso._id === ingresoId);
    setSelectedIngreso(selected);
    setShowUpdateModal(true);
  };



  const showData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/ingresos');
      const data = await response.json();

    
      const ingresosWithProveedorNames = await Promise.all(
        data.map(async (ingreso) => {
          const nombreProveedor = await getNameById(ingreso.id_proveedor);

          return {
            ...ingreso,
            id_proveedor: nombreProveedor,
          };
        })
      );

      setIngresos(ingresosWithProveedorNames);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const filteredItems = ingresos.filter(
    (item) =>
      item.id_proveedor && item.id_proveedor.toLowerCase().includes(filterText.toLowerCase())
  );


  const columns = [
 
    {
      name: 'ID Usuario',
      selector: (row) => row.id_usuario,
      sortable: true,
      center: true,
    },
    {
        name: 'Proveedor',
      selector: (row) => row.id_proveedor,
      sortable: true,
      center: true,
    },
    {
        name: 'Fecha',
        selector: (row) => {
          const date = new Date(row.fecha);
          return date.toLocaleDateString('es-ES');
        },
        sortable: true,
        center: true,
      },
    {
      name: 'IVA',
      selector: (row) => row.iva,
      sortable: true,
      center: true,
    },
    {
      name: 'Descuento',
      selector: (row) => row.descuento,
      sortable: true,
      center: true,
    },
    {
      name: 'Subtotal',
      selector: (row) => row.subtotal,
      sortable: true,
      center: true,
    },
    {
        
            name: 'Total',
            selector: (row) => row.total.toFixed(2),
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
          placeholder="Buscar por ID Usuario"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    try {
      const createUrl = 'http://localhost:4000/api/ingresos';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIngreso),
      });

      if (response.ok) {
        console.log('Ingreso creado exitosamente.');
        handleNotificacion();
        showData();
      } else {
        console.error('Error al intentar crear el ingreso.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/ingresos/${selectedIngreso._id}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedIngreso),
      });

      if (response.ok) {
        console.log('Ingreso actualizado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar el ingreso.');
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
    }

    handleClose();
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <Styles.AppContainer>
      <Navbar />
     
      <Styles.StyledDataTable
        columns={columns}
        data={ingresos}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />

      

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            
            <Form.Group controlId="formIdProveedor">
              <Form.Label>ID Proveedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el ID Proveedor"
                value={selectedIngreso ? selectedIngreso.id_proveedor : ''}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    id_proveedor: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la fecha"
                value={selectedIngreso ? selectedIngreso.fecha : ''}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    fecha: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formIVA">
              <Form.Label>IVA</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el IVA"
                value={selectedIngreso ? selectedIngreso.iva : 0}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    iva: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescuento">
              <Form.Label>Descuento</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el descuento"
                value={selectedIngreso ? selectedIngreso.descuento : 0}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    descuento: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formSubtotal">
              <Form.Label>Subtotal</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el subtotal"
                value={selectedIngreso ? selectedIngreso.subtotal : 0}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    subtotal: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTotal">
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el total"
                value={selectedIngreso ? selectedIngreso.total : 0}
                onChange={(e) =>
                  setSelectedIngreso({
                    ...selectedIngreso,
                    total: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Guardar cambios
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default HistorialIngresosView;
