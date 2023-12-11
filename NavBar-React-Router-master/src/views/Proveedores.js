import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal, ToastContainer } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';

const ProveedoresView = () => {
  const [proveedores, setProveedores] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newProveedor, setNewProveedor] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    descripcion: '',
    estado: true,
  });
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewProveedor({
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      descripcion: '',
      estado: true,
    });
    setSelectedProveedor(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const url = 'http://localhost:4000/api/proveedores';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (proveedorId) => {
    try {
      const response = await fetch(`${url}/${proveedorId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Proveedor con ID ${proveedorId} eliminado correctamente`);
        showData();
      } else {
        console.error(`Error al intentar eliminar el proveedor con ID ${proveedorId}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = proveedores.filter(
    (item) => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProveedor),
      });

      if (response.ok) {
        console.log('Proveedor creado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar crear el proveedor.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdate = (proveedorId) => {
    const selected = proveedores.find((proveedor) => proveedor._id === proveedorId);
    setSelectedProveedor(selected);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${url}/${selectedProveedor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProveedor),
      });

      if (response.ok) {
        console.log('Proveedor actualizado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar el proveedor.');
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
    }

    handleClose();
  };

  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'NOMBRE',
      selector: (row) => row.nombre,
      sortable: true,
      center: true,
    },
    {
      name: 'DIRECCIÓN',
      selector: (row) => row.direccion,
      sortable: true,
      center: true,
    },
    {
      name: 'TELÉFONO',
      selector: (row) => row.telefono,
      sortable: true,
      center: true,
    },
    {
      name: 'CORREO',
      selector: (row) => row.correo,
      sortable: true,
      center: true,
    },
    {
      name: 'DESCRIPCIÓN',
      selector: (row) => row.descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'ESTADO',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
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
          <Styles.ActionButton onClick={() => handleDelete(row._id)}>
            <FaTrash />
          </Styles.ActionButton>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <Styles.AppContainer>
      <Navbar />
      <Styles.CreateButton variant="primary" onClick={handleShow}>
        Crear
      </Styles.CreateButton>

      <Styles.StyledDataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        persistTableHead
      />

      <Styles.StyledModal show={showCreateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={newProveedor.nombre}
                onChange={(e) => setNewProveedor({ ...newProveedor, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la dirección"
                value={newProveedor.direccion}
                onChange={(e) => setNewProveedor({ ...newProveedor, direccion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el teléfono"
                value={newProveedor.telefono}
                onChange={(e) => setNewProveedor({ ...newProveedor, telefono: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el correo"
                value={newProveedor.correo}
                onChange={(e) => setNewProveedor({ ...newProveedor, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newProveedor.descripcion}
                onChange={(e) =>
                  setNewProveedor({ ...newProveedor, descripcion: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newProveedor.estado ? 'Activo' : 'Inactivo'}
                onChange={(e) =>
                  setNewProveedor({ ...newProveedor, estado: e.target.value === 'Activo' })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
        <Button className="otros" variant="primary" onClick={handleCreate}>
            Guardar
          </Button>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
         
        </Styles.ModalFooter>
      </Styles.StyledModal>

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedProveedor ? selectedProveedor.nombre : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDireccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la dirección"
                value={selectedProveedor ? selectedProveedor.direccion : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    direccion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el teléfono"
                value={selectedProveedor ? selectedProveedor.telefono : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    telefono: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formCorreo">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el correo"
                value={selectedProveedor ? selectedProveedor.correo : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    correo: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedProveedor ? selectedProveedor.descripcion : ''}
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={
                  selectedProveedor ? (selectedProveedor.estado ? 'Activo' : 'Inactivo') : ''
                }
                onChange={(e) =>
                  setSelectedProveedor({
                    ...selectedProveedor,
                    estado: e.target.value === 'Activo',
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
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
      <ToastContainer/>
    </Styles.AppContainer>
  );
};

export default ProveedoresView;
