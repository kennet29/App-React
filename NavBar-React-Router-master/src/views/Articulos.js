import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores'; // Update import for styles
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ArticulosView = () => {
  const [articulos, setArticulos] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [newArticulo, setNewArticulo] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    categoria: '',
  });
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const handleNotificacion = () => {
   
    toast.success('Operación exitosa', { position: toast.POSITION.TOP_CENTER });
  };

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewArticulo({
      nombre: '',
      descripcion: '',
      estado: true,
      categoria: '',
    });
    setSelectedArticulo(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (articuloId) => {
    const selected = articulos.find((articulo) => articulo._id === articuloId);
    setSelectedArticulo({
      ...selected,
      categoria: selected.categoria._id, // Set the category ID for the select value
    });
    setShowUpdateModal(true);
  };

  const showArticulos = async () => {
    try {
      const articulosResponse = await fetch('http://localhost:4000/api/articulos');
      const categoriasResponse = await fetch('http://localhost:4000/api/categorias');

      const articulosData = await articulosResponse.json();
      const categoriasData = await categoriasResponse.json();

      // Map categoria IDs to categoria objects
      const categoriasMap = categoriasData.reduce((map, categoria) => {
        map[categoria._id] = categoria;
        return map;
      }, {});

      // Associate categoria object with each articulo
      const articulosWithCategoria = articulosData.map((articulo) => ({
        ...articulo,
        categoria: categoriasMap[articulo.categoria],
      }));

      setArticulos(articulosWithCategoria);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showCategorias = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleDelete = (articuloId) => {
    setDeleteItemId(articuloId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const deleteUrl = `http://localhost:4000/api/articulos/${deleteItemId}`;
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Articulo con ID ${deleteItemId} borrado exitosamente.`);
        showArticulos();
        toast.success('Artículo eliminado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        console.error(`Error al borrar el articulo con ID ${deleteItemId}.`);
        toast.error('Error al intentar eliminar el artículo', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error al realizar la solicitud DELETE:', error);
      toast.error('Error al intentar eliminar el artículo', { position: toast.POSITION.TOP_CENTER });
    } finally {
      closeDeleteConfirmationModal();
    }
  };

  const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setDeleteItemId(null);
  };

  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  const filteredItems = articulos.filter(
    (item) =>
      item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
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
      const createUrl = 'http://localhost:4000/api/articulos';
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArticulo),
      });

      if (response.ok) {
        handleNotificacion();
        showArticulos();
      } else {
        toast.error('Por favor complete los campos',{ position: toast.POSITION.TOP_CENTER });
        console.error('Error al intentar crear el articulo.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/articulos/${selectedArticulo._id}`;
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedArticulo),
      });

      if (response.ok) {
        console.log('Articulo actualizado exitosamente.');
        showArticulos();
        toast.success('Artículo actualizado correctamente', { position: toast.POSITION.TOP_CENTER });
      } else {
        console.error('Error al intentar actualizar el articulo.');
        toast.error('Error al intentar actualizar el artículo', { position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      console.error('Error en la solicitud de actualización:', error);
      toast.error('Error en la solicitud de actualización', { position: toast.POSITION.TOP_CENTER });
    }

    handleClose();
  };

  useEffect(() => {
    showArticulos();
    showCategorias();
  }, []);

  const columns = [
    {
      name: 'Nombre',
      selector: (row) => row.nombre,
      sortable: true,
      center: true,
    },
    {
      name: 'Descripción',
      selector: (row) => row.descripcion,
      sortable: true,
      center: true,
    },
    {
      name: 'Estado',
      selector: (row) => (row.estado ? 'Activo' : 'Inactivo'),
      sortable: true,
      center: true,
    },
    {
      name: 'Categoría',
      selector: (row) => row.categoria.categoria, // Display category name instead of ID
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
          <Modal.Title>Crear Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={newArticulo.nombre}
                onChange={(e) => setNewArticulo({ ...newArticulo, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newArticulo.descripcion}
                onChange={(e) => setNewArticulo({ ...newArticulo, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newArticulo.estado}
                onChange={(e) => setNewArticulo({ ...newArticulo, estado: e.target.value })}
              >
                <option value="">Selecciona un Estado</option>
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={newArticulo.categoria}
                onChange={(e) => setNewArticulo({ ...newArticulo, categoria: e.target.value })}
              >
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.categoria}
                  </option>
                ))}
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
          <Modal.Title>Actualizar Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                value={selectedArticulo ? selectedArticulo.nombre : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    nombre: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedArticulo ? selectedArticulo.descripcion : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedArticulo ? selectedArticulo.estado : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    estado: e.target.value,
                  })
                }
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={selectedArticulo ? selectedArticulo.categoria : ''}
                onChange={(e) =>
                  setSelectedArticulo({
                    ...selectedArticulo,
                    categoria: e.target.value,
                  })
                }
              >
                {categorias.map((categoria) => (
                  <option key={categoria._id} value={categoria._id}>
                    {categoria.categoria}
                  </option>
                ))}
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
      <Styles.AppContainer>
   
      <Styles.StyledModal show={showDeleteConfirmation} onHide={closeDeleteConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar este artículo?</p>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={handleDeleteConfirmed}>
            Sí
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={closeDeleteConfirmationModal}>
            Cancelar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>
   
    </Styles.AppContainer>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default ArticulosView;
