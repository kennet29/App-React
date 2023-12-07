import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Navbar from '../component/Navbar';

const PromocionesView = () => {
  const [promociones, setPromociones] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [newPromocion, setNewPromocion] = useState({
    promocion: '',
    fecha_inicio: '',
    fecha_final: '',
    descuento: 0,
    descripcion: '',
    estado: true,
    cantidad_Articulos: 0,
  });
  const [selectedPromocion, setSelectedPromocion] = useState(null);

  const handleClose = () => {
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setNewPromocion({
      promocion: '',
      fecha_inicio: '',
      fecha_final: '',
      descuento: 0,
      descripcion: '',
      estado: true,
      cantidad_Articulos: 0,
    });
    setSelectedPromocion(null);
  };

  const handleShow = () => setShowCreateModal(true);

  const url = 'http://localhost:4000/api/promociones';

  const showData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPromociones(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ... (Previous code remains unchanged)

  const handleDelete = async (promocionId) => {
    try {
      const response = await fetch(`${url}/${promocionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Promoción con ID ${promocionId} eliminada correctamente`);
        showData();
      } else {
        console.error(`Error al intentar eliminar la promoción con ID ${promocionId}`);
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

  const filteredItems = promociones.filter(
    (item) => item.promocion && item.promocion.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    return (
      <div style={{ display: 'flex', margin: '0 auto', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Buscar por promoción"
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
        body: JSON.stringify(newPromocion),
      });

      if (response.ok) {
        console.log('Promoción creada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar crear la promoción.');
      }
    } catch (error) {
      console.error('Error en la solicitud de creación:', error);
    }

    handleClose();
  };
  const handleUpdate = (promocionId) => {
    const selected = promociones.find((promocion) => promocion._id === promocionId);
    setSelectedPromocion(selected);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${url}/${selectedPromocion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPromocion),
      });

      if (response.ok) {
        console.log('Promoción actualizada exitosamente.');
        showData();
      } else {
        console.error('Error al intentar actualizar la promoción.');
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
      name: 'PROMOCIÓN',
      selector: (row) => row.promocion,
      sortable: true,
      center: true,
    },
    {
      name: 'FECHA INICIO',
      selector: (row) => row.fecha_inicio,
      sortable: true,
      center: true,
    },
    {
      name: 'FECHA FINAL',
      selector: (row) => row.fecha_final,
      sortable: true,
      center: true,
    },
    {
      name: 'DESCUENTO',
      selector: (row) => `${row.descuento}%`,
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
      name: 'CANTIDAD',
      selector: (row) => row.cantidad_Articulos,
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
          <Modal.Title>Crear Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPromocion">
              <Form.Label>Promoción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la promoción"
                value={newPromocion.promocion}
                onChange={(e) => setNewPromocion({ ...newPromocion, promocion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={newPromocion.fecha_inicio}
                onChange={(e) => setNewPromocion({ ...newPromocion, fecha_inicio: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formFechaFinal">
              <Form.Label>Fecha Final</Form.Label>
              <Form.Control
                type="date"
                value={newPromocion.fecha_final}
                onChange={(e) => setNewPromocion({ ...newPromocion, fecha_final: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescuento">
              <Form.Label>Descuento (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el descuento"
                value={newPromocion.descuento}
                onChange={(e) => setNewPromocion({ ...newPromocion, descuento: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={newPromocion.descripcion}
                onChange={(e) => setNewPromocion({ ...newPromocion, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={newPromocion.estado ? 'Activo' : 'Inactivo'}
                onChange={(e) =>
                  setNewPromocion({ ...newPromocion, estado: e.target.value === 'Activo' })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCantidadArticulos">
              <Form.Label>Cantidad de Artículos</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese la cantidad de artículos"
                value={newPromocion.cantidad_Articulos}
                onChange={(e) =>
                  setNewPromocion({
                    ...newPromocion,
                    cantidad_Articulos: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="otros" variant="primary" onClick={handleCreate}>
            Guardar
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>

      {/* ... (Previous code remains unchanged) */}

      <Styles.StyledModal show={showUpdateModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Promoción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPromocion">
              <Form.Label>Promoción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la promoción"
                value={selectedPromocion ? selectedPromocion.promocion : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    promocion: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFechaInicio">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="date"
                value={selectedPromocion ? selectedPromocion.fecha_inicio : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    fecha_inicio: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formFechaFinal">
              <Form.Label>Fecha Final</Form.Label>
              <Form.Control
                type="date"
                value={selectedPromocion ? selectedPromocion.fecha_final : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    fecha_final: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescuento">
              <Form.Label>Descuento (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el descuento"
                value={selectedPromocion ? selectedPromocion.descuento : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    descuento: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                value={selectedPromocion ? selectedPromocion.descripcion : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
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
                  selectedPromocion ? (selectedPromocion.estado ? 'Activo' : 'Inactivo') : ''
                }
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    estado: e.target.value === 'Activo',
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCantidadArticulos">
              <Form.Label>Cantidad de Artículos</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese la cantidad de artículos"
                value={selectedPromocion ? selectedPromocion.cantidad_Articulos : ''}
                onChange={(e) =>
                  setSelectedPromocion({
                    ...selectedPromocion,
                    cantidad_Articulos: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Styles.ModalFooter>
          <Button className="otros" variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button className="otros" variant="primary" onClick={handleUpdateSubmit}>
            Guardar cambios
          </Button>
        </Styles.ModalFooter>
      </Styles.StyledModal>
      <Footer />
    </Styles.AppContainer>
  );
};

export default PromocionesView;


