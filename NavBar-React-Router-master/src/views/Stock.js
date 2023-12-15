import React, { useState, useEffect } from 'react';
import { Table,FormControl, InputGroup } from 'react-bootstrap';
import * as Styles from '../css/styles_colores';
import Footer from '../component/footer/footer';
import Navbar from '../component/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const StockView = () => {
  const [stockData, setStockData] = useState([]);
  const [articulosData, setArticulosData] = useState({});
  const [colorData, setColorData] = useState({});
  const [marcaData, setMarcaData] = useState({});
  const [tallaData, setTallaData] = useState({});
  const [estiloData, setEstiloData] = useState({});
  const [materialData, setMaterialData] = useState({});
  const [disenoData, setDisenoData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDataCallback(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchData('http://localhost:4000/api/stock', setStockData);
    fetchData('http://localhost:4000/api/articulos', data => {
      const articulosMap = {};
      data.forEach(articulo => {
        articulosMap[articulo._id] = articulo;
      });
      setArticulosData(articulosMap);
    });
    fetchData('http://localhost:4000/api/colores', data => {
      const colorMap = {};
      data.forEach(color => {
        colorMap[color._id] = color.color;
      });
      setColorData(colorMap);
    });
    fetchData('http://localhost:4000/api/marcas', data => {
      const marcaMap = {};
      data.forEach(marca => {
        marcaMap[marca._id] = marca.marca;
      });
      setMarcaData(marcaMap);
    });
    fetchData('http://localhost:4000/api/tallas', data => {
      const tallaMap = {};
      data.forEach(talla => {
        tallaMap[talla._id] = talla.talla;
      });
      setTallaData(tallaMap);
    });
    fetchData('http://localhost:4000/api/estilos', data => {
      const estiloMap = {};
      data.forEach(estilo => {
        estiloMap[estilo._id] = estilo.estilo;
      });
      setEstiloData(estiloMap);
    });
    fetchData('http://localhost:4000/api/materiales/', data => {
      const materialMap = {};
      data.forEach(material => {
        materialMap[material._id] = material.material;
      });
      setMaterialData(materialMap);
    });
    fetchData('http://localhost:4000/api/disenos', data => {
      const disenoMap = {};
      data.forEach(diseno => {
        disenoMap[diseno._id] = diseno.diseno;
      });
      setDisenoData(disenoMap);
    });
  }, []);

  const getColorNameById = (colorId) => {
    return colorData[colorId] || 'N/A';
  };

  const getArticuloNombre = (articuloId) => {
    const articulo = articulosData[articuloId];
    return articulo ? articulo.nombre : 'Nombre no encontrado';
  };



  const handleSearch = () => {
    // Implement your search logic here
    // For example, you can filter the stockData based on the searchTerm
    // and update the state accordingly.
  };



  return (
    <Styles.AppContainer>
      <Navbar />
      <div style={{ display: 'flex', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={handleSearch} style={{width:'100px',height:'40px', backgroundColor:'red',borderRadius:'5px', color:'white',marginLeft:'auto',marginRight:'auto'}}>
            Buscar
          </button>
        </div>
      <div style={{ overflowX: 'auto', overflowY: 'auto', width: '90%' }}>
     
        <Table striped bordered hover>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th>Articulo</th>
              <th>User</th>
              <th>Color</th>
              <th>Marca</th>
              <th>Talla</th>
              <th>Estilo</th>
              <th>Material </th>
              <th>Diseño </th>
              <th>Descuento</th>
              <th>Descuento Máximo</th>
              <th>Bodega ID</th>
              <th>Precio Proveedor</th>
              <th>Precio Venta</th>
              <th>Estado</th>
              <th>Daños</th>
              <th>Descripción</th>
              <th>Ingreso ID</th>
              <th>Código de Barras</th>
              <th>Promoción </th>
            </tr>
          </thead>
          <tbody>
            {stockData.map(item => (
              <tr key={item._id}>
                <td>{getArticuloNombre(item.Id_articulo)}</td>
                <td>{item.Id_usuario}</td>
                <td>{getColorNameById(item.Id_color)}</td>
                <td>{marcaData[item.Id_marca]}</td>
                <td>{tallaData[item.Id_talla]}</td>
                <td>{estiloData[item.Id_estilo]}</td>
                <td>{materialData[item.Id_material]}</td>
                <td>{disenoData[item.Id_diseño]}</td>
                <td>{item.Descuento}%</td>
                <td>{item.Descuento_maximo}%</td>
                <td>{item.Id_bodega}</td>
                <td>{item.Precio_prov}</td>
                <td>{item.Precio_venta}</td>
                <td>{item.Estado ? 'Activo' : 'Inactivo'}</td>
                <td>{item.Daños ? 'Sí' : 'No'}</td>
                <td>{item.Descripcion}</td>
                <td>{item.Id_ingreso}</td>
                <td>{item.Cod_barra}</td>
                <td>{item.Id_promocion}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
      <ToastContainer />
    </Styles.AppContainer>
  );
};

export default StockView;
