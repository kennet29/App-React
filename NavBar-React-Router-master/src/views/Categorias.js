import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CategoriasView = () => {
  const [categorias, setCategorias] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newCategoria, setNewCategoria] = useState({
    categoria: '',
    estado: '',
    descripcion: '',
  });
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const handleNotificacion = () => {
   
    toast.success('Operación exitosa', { position: toast.POSITION.TOP_CENTER });
  };


  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewCategoria({
      categoria: '',
      estado: '',
      descripcion: '',
    });
    setSelectedCategoria(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (categoriaId) => {
    const selected = categorias.find((categoria) => categoria._id === categoriaId);
    setSelectedCategoria(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/categorias';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (categoriaId) => {
    try {
      const deleteUrl = `http://localhost:4000/api/categorias/${categoriaId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Categoría con ID ${categoriaId} eliminada exitosamente.`);
        // After successful deletion, update the UI by fetching and displaying the updated data
        showData();
      } else {
        console.error(`Error al intentar borrar la categoría con ID ${categoriaId}.`);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    }
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = categorias.filter(
    (item) =>
      item.categoria && item.categoria.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por categoría"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
    );
  }, [filterText, resetPaginationToggle]);

  const handleCreate = async () => {
    try {
      const createUrl = 'http://localhost:4000/api/categorias';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategoria),
      });

      if (response.ok) {
        console.log('Categoría creada exitosamente.');
        handleNotificacion();
        showData();
      } else {
        console.error('Error al intentar crear la categoría.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/categorias/${selectedCategoria._id}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCategoria),
      });

      if (response.ok) {
        console.log('Categoría actualizada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar la categoría.');
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
      name: 'CATEGORÍA',
      selector: (row) => row.categoria,
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
          <Modal.Title>Crear Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la categoría"
                value={newCategoria.categoria}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, categoria: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={newCategoria.estado}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, estado: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newCategoria.descripcion}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, descripcion: e.target.value })
                }
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
          <Modal.Title>Actualizar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la categoría"
                value={selectedCategoria ? selectedCategoria.categoria : ''}
                onChange={(e) =>
                  setSelectedCategoria({
                    ...selectedCategoria,
                    categoria: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                value={selectedCategoria ? selectedCategoria.estado : ''}
                onChange={(e) =>
                  setSelectedCategoria({
                    ...selectedCategoria,
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
                value={selectedCategoria ? selectedCategoria.descripcion : ''}
                onChange={(e) =>
                  setSelectedCategoria({
                    ...selectedCategoria,
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

export default CategoriasView;
