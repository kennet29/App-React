import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import MyNavbar from '../component/Navbar';
import Footer from '../component/footer/footer';
import { FaEye } from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import { Container, Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap'; // Asegúrate de importar la librería de modales que estás utilizando

const HistorialIngresosView = () => {
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para controlar la visibilidad del modal

  useEffect(() => {
    fetch('http://localhost:4000/api/detalleingreso')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => ({
          _id: item._id,
          id_ingreso: item.id_ingreso,
          total: item.total,
          // Utiliza directamente los artículos del arreglo presente en la respuesta
          articulos: item.articulos,
        }));

        setData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

 

  const handlePrint = (row) => {
    // Al hacer clic en el botón, guarda la información del registro seleccionado
    setSelectedRecord(row);
    // Abre el modal
    setModalVisible(true);
  };

  const handleViewDetails = (row) => {
    // Implementa la lógica para ver detalles
  };

  const closeModal = () => {
    // Cierra el modal al hacer clic fuera del contenido o en el botón de cerrar
    setModalVisible(false);
  };

  const columns = [
    { name: '_id', selector: '_id', sortable: true },
    { name: 'id_ingreso', selector: 'id_ingreso', sortable: true },
    { name: 'proveedor_nombre', selector: 'proveedor_nombre', sortable: true },
    { name: 'total', selector: 'total', sortable: true },
    {
      name: 'Acciones',
      cell: row => (
        <div>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', marginRight: '2px', borderRadius: '5px', color: 'white' }} onClick={() => handlePrint(row)}><FaEye /></button>
          <button style={{ width: '35px', height: '35px', backgroundColor: 'blue', borderRadius: '5px', color: 'white' }} onClick={() => handleViewDetails(row)}><MdPrint /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <MyNavbar />
      <div style={{ width: '90%', margin: 'auto', borderRadius: '5px', border: '2px solid black', textAlign: 'center' }}>
        <DataTable
          title="Historial de Ingresos"
          columns={columns}
          data={data}
          pagination
        />
      </div>

      <Modal
        size="xl"
        show={modalVisible}
        onHide={closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Ingreso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <div>
              <h5>ID de Ingreso: {selectedRecord.id_ingreso}</h5>
              <h5>Total: {selectedRecord.total}</h5>

              {/* Replace the plain list with a DataTable */}
              <DataTable
                title="Artículos"
                columns={[
                  { name: 'ID de Artículo', selector: 'id_articulo', sortable: true },
                  { name: 'Cantidad', selector: 'cantidad', sortable: true },
                  { name: 'Precio Proveedor', selector: 'precio_proveedor', sortable: true },
                  { name: 'Subtotal', selector: 'subtotal', sortable: true },
                ]}
                data={selectedRecord.articulos}
                pagination
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


      <Footer />
    </div>
  );
};

export default HistorialIngresosView;
