import React, { useState } from 'react';
import { Container, Button, Modal, Form, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsuariosView = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateUser = () => {
    toast.success('Usuario creado exitosamente', { position: toast.POSITION.TOP_CENTER });
    handleModalClose();
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <Container style={containerStyle}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Usuarios</h1>
      
      <Button variant="primary" size="lg" block onClick={handleModalShow} style={{ fontSize:'15px', margin: '20px auto', display: 'block',width:'100px',height:'60px' }}>
  Crear Usuario
</Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese su nombre" />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su email" />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Ingrese su contraseña" />
            </Form.Group>

          

 <Form.Group controlId="formRoles">
  <Form.Label>Roles</Form.Label>
  <Col style={{ marginLeft: '5%', display: 'flex', flexDirection: 'column' }}>
    <Form.Check
      style={checkboxStyle}
      type="checkbox"
      label="Usuario"
    />
    <Form.Check
      style={checkboxStyle}
      type="checkbox"
      label="Moderador"
    />
    <Form.Check
      style={checkboxStyle}
      type="checkbox"
      label="Admin"
    />
  </Col>
</Form.Group>


          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" style={{width:'100px',height:'60px'}} onClick={handleCreateUser}>
            Crear
          </Button>
          <Button variant="secondary" style={{width:'100px',height:'60px'}} onClick={handleModalClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default UsuariosView;

const containerStyle = {
  height: '600px',
  width: '100%',
  margin: '0',
  backgroundImage: 'linear-gradient(to right top, #80285a, #742a62, #652d69, #54306e, #3f3371, #323d7a, #204781, #005086, #006290, #007393, #008391, #04928b)',
};

const checkboxStyle = {
  with:'10px'
  };
