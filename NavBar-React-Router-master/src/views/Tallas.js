import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal, ToastContainer } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { FaTrash,FaEdit } from 'react-icons/fa';
const TallasView = () => {
  const [tallas, setTallas] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newTalla, setNewTalla] = useState({
    talla: '',
    estado: '',
    descripcion: '',
  });
  const [selectedTalla, setSelectedTalla] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewTalla({
      talla: '',
      estado: '',
      descripcion: '',
    });
    setSelectedTalla(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (tallaId) => {
    const selected = tallas.find((talla) => talla._id === tallaId);
    setSelectedTalla(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/tallas';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTallas(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (tallaId) => {
    try {
      const response = await fetch(`${url}/${tallaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Talla con ID ${tallaId} eliminada correctamente`);
        showData(); // Refresh data after successful deletion
      } else {
        console.error(`Error al intentar eliminar la talla con ID ${tallaId}`);
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

  const filteredItems = tallas.filter(
    (item) => item.talla && item.talla.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por talla"
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
        body: JSON.stringify(newTalla),
      });

      if (response.ok) {
        console.log('Talla creada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar crear la talla.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${url}/${selectedTalla._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTalla),
      });

      if (response.ok) {
        console.log('Talla actualizada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar la talla.');
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
      name: 'TALLA',
      selector: (row) => row.talla,
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
      name: 'DESCRIPCIÓN',
      selector: (row) => row.descripcion,
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
          <Modal.Title>Crear Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTalla">
              <Form.Label>Talla</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la talla"
                value={newTalla.talla}
                onChange={(e) => setNewTalla({ ...newTalla, talla: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={newTalla.estado}
                onChange={(e) => setNewTalla({ ...newTalla, estado: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newTalla.descripcion}
                onChange={(e) => setNewTalla({ ...newTalla, descripcion: e.target.value })}
              />
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
          <Modal.Title>Actualizar Talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTalla">
              <Form.Label>Talla</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la talla"
                value={selectedTalla ? selectedTalla.talla : ''}
                onChange={(e) =>
                  setSelectedTalla({
                    ...selectedTalla,
                    talla: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={selectedTalla ? selectedTalla.estado : ''}
                onChange={(e) =>
                  setSelectedTalla({
                    ...selectedTalla,
                    estado: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedTalla ? selectedTalla.descripcion : ''}
                onChange={(e) =>
                  setSelectedTalla({
                    ...selectedTalla,
                    descripcion: e.target.value,
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

export default TallasView;
