import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal} from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../component/Navbar';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisenosView = () => {
  const [disenos, setDisenos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newDiseno, setNewDiseno] = useState({
    diseno: '',
    estado: '',
    descripcion: '',
  });
  const [selectedDiseno, setSelectedDiseno] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewDiseno({
      diseno: '',
      estado: '',
      descripcion: '',
    });
    setSelectedDiseno(null);
  };

  const handleNotificacion = () => {
   
    toast.success('Operación exitosa', { position: toast.POSITION.TOP_CENTER });
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (disenoId) => {
    const selected = disenos.find((diseno) => diseno._id === disenoId);
    setSelectedDiseno(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/disenos';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setDisenos(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (disenoId) => {
    try {
      const response = await fetch(`${url}/${disenoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Diseño con ID ${disenoId} eliminado correctamente`);
        showData(); // Refresh the data after deletion
      } else {
        console.error(`Error al eliminar el diseño con ID ${disenoId}`);
        // Provide user-friendly feedback here if needed
      }
    } catch (error) {
      console.error('Error deleting design:', error);
  
    }
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = disenos.filter(
    (item) => item.diseno && item.diseno.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por diseño"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    try {
      const createUrl = 'http://localhost:4000/api/disenos';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiseno),
      });

      if (response.ok) {
        console.log('Diseño creado exitosamente.');
        handleNotificacion();
        showData();
      } else {
        console.error('Error al intentar crear el diseño.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/disenos/${selectedDiseno._id}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedDiseno),
      });

      if (response.ok) {
        console.log('Diseño actualizado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar el diseño.');
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
      name: 'DISEÑO',
      selector: (row) => row.diseno,
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
        {/* Update button with edit icon */}
        <Styles.ActionButton onClick={() => handleUpdate(row._id)} update>
          <FaEdit /> 
        </Styles.ActionButton>

        {/* Delete button with trash icon */}
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
          <Modal.Title>Crear Diseño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDiseno">
              <Form.Label>Diseño</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el diseño"
                value={newDiseno.diseno}
                onChange={(e) => setNewDiseno({ ...newDiseno, diseno: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={newDiseno.estado}
                onChange={(e) => setNewDiseno({ ...newDiseno, estado: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newDiseno.descripcion}
                onChange={(e) => setNewDiseno({ ...newDiseno, descripcion: e.target.value })}
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
          <Modal.Title>Actualizar Diseño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDiseno">
              <Form.Label>Diseño</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el diseño"
                value={selectedDiseno ? selectedDiseno.diseno : ''}
                onChange={(e) =>
                  setSelectedDiseno({
                    ...selectedDiseno,
                    diseno: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={selectedDiseno ? selectedDiseno.estado : ''}
                onChange={(e) =>
                  setSelectedDiseno({
                    ...selectedDiseno,
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
                value={selectedDiseno ? selectedDiseno.descripcion : ''}
                onChange={(e) =>
                  setSelectedDiseno({
                    ...selectedDiseno,
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

export default DisenosView;
