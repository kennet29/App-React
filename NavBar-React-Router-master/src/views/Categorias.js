import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash,FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const CategoriasView = () => {
  const [cookieData, setCookieData] = useState({
    miCookie: Cookies.get('miCookie') || null, 
  });
  const [categorias, setCategorias] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [newCategoria, setNewCategoria] = useState({
    categoria: '',
    estado: '',
    descripcion: '',
  });
  const [selectedCategoria, setSelectedCategoria] = useState(null);


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

  const handleDelete = (categoriaId) => {
    setCategoryToDelete(categoriaId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deleteUrl = `http://localhost:4000/api/categorias/${categoryToDelete}`;
      const token = Cookies.get('token'); // Get the token from cookies

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token, // Include the token in the header
        },
      });
      console.log('Data sent in handleConfirmDelete:', JSON.stringify({ categoriaId: categoryToDelete }));

      if (response.ok) {
        console.log(`Categoría con ID ${categoryToDelete} eliminada exitosamente.`);
        toast.success('Categoría eliminada exitosamente', { position: toast.POSITION.TOP_CENTER });
        showData();
      } else {
        console.error(`Error al intentar borrar la categoría con ID ${categoryToDelete}.`);
      }
    } catch (error) {
      console.error('Error en la solicitud de eliminación:', error);
    } finally {
      setShowConfirmationModal(false);
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
      const token = Cookies.get('token');
      const response = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(newCategoria),
      });
  
      if (response.ok) {
        toast.success('Categoría creada exitosamente', { position: toast.POSITION.TOP_CENTER });
        // After creating the category, refresh the data
        showData();
      } else {
        console.error('Error al intentar crear la categoría.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
      toast.error('Error en la solicitud de creación', { position: toast.POSITION.TOP_CENTER });
    }
  
    handleClose();
  };
  

  useEffect(() => {
    showData();
  }, []);
  

  const handleUpdateSubmit = async () => {
    try {
      const updateUrl = `http://localhost:4000/api/categorias/${selectedCategoria._id}`;
      const token = Cookies.get('token');
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(selectedCategoria),
      });

      if (response.ok) {
        toast.error('Por favor complete todos los campos', { position: toast.POSITION.TOP_CENTER });
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
    as="select"
    value={newCategoria.estado}
    onChange={(e) => setNewCategoria({ ...newCategoria, estado: e.target.value })}
  >
    <option value="">Seleccionar estado</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
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
    as="select"
    value={selectedCategoria ? selectedCategoria.estado.toString() : ''}
    onChange={(e) => setSelectedCategoria({ ...selectedCategoria, estado: e.target.value })}
  >
    <option value="">Seleccionar estado</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
  </Form.Control>
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

      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header style={{backgroundColor:'#4a4a4a',color:'white'}} closeButton>
          <Modal.Title style={{backgroundColor:'#4a4a4a',color:'white'}}>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor:'#4a4a4a',color:'white'}}>¿Está seguro de que desea eliminar esta categoría?</Modal.Body>
        <Modal.Footer style={{backgroundColor:'#4a4a4a',color:'white'}}>
          
          <Button style={{ width: '100px', height: '50px' }} variant="danger" onClick={handleConfirmDelete}>
            Confirmar
          </Button>
          <Button style={{ width: '100px', height: '50px' }} variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default CategoriasView;
