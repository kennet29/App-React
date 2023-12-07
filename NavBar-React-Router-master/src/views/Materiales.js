import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';

const MaterialesView = () => {
  const [materiales, setMateriales] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    material: '',
    descripcion: '',
    estado: true,
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewMaterial({
      material: '',
      descripcion: '',
      estado: true,
    });
    setSelectedMaterial(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const handleUpdate = (materialId) => {
    const selected = materiales.find((material) => material._id === materialId);
    setSelectedMaterial(selected);
    setShowUpdateModal(true);
  };

  const url = 'http://localhost:4000/api/materiales';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMateriales(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (materialId) => {
    try {
      const response = await fetch(`${url}/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Material con ID ${materialId} eliminado correctamente`);
        showData(); // Refresh data after successful deletion
      } else {
        console.error(`Error al intentar eliminar el material con ID ${materialId}`);
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

  const filteredItems = materiales.filter(
    (item) => item.material && item.material.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por material"
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
        body: JSON.stringify(newMaterial),
      });

      if (response.ok) {
        console.log('Material creado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar crear el material.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${url}/${selectedMaterial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedMaterial),
      });

      if (response.ok) {
        console.log('Material actualizado exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar el material.');
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
      name: 'MATERIAL',
      selector: (row) => row.material,
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
      <Navbar/>
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
          <Modal.Title>Crear Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMaterial">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el material"
                value={newMaterial.material}
                onChange={(e) => setNewMaterial({ ...newMaterial, material: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newMaterial.descripcion}
                onChange={(e) => setNewMaterial({ ...newMaterial, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newMaterial.estado ? 'Activo' : 'Inactivo'}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, estado: e.target.value === 'Activo' })
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
          <Modal.Title>Actualizar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMaterial">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el material"
                value={selectedMaterial ? selectedMaterial.material : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
                    material: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedMaterial ? selectedMaterial.descripcion : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedMaterial ? (selectedMaterial.estado ? 'Activo' : 'Inactivo') : ''}
                onChange={(e) =>
                  setSelectedMaterial({
                    ...selectedMaterial,
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
    </Styles.AppContainer>
  );
};

export default MaterialesView;

