import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;

export const StyledDataTable = styled(DataTable)`
  border: 2px solid #333;
  border-radius: 8px;
  width: 80%;
  margin-bottom: 5px;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => (props.update ? '#4CAF50' : '#f44336')};
  color: #fff;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  width: 40px;
  height: 40px;
`;

export const CreateButton = styled(Button)`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100px;
  height: 50px;
`;
export const StyledModal = styled(Modal)`
  .modal-content {
    background-color: #4a4a4a;
    color: white;
    text-align: center;
    width:450px;
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 10px 10px;
  }
`;

export const ModalFooter = styled(Modal.Footer)`
  .otros {
    width: 150px;  // Adjust the width as needed
    height: 60px;  // Adjust the height as needed
  }
`;
