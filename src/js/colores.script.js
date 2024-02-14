// coloresFunctions.js
export const showData = async (url, setUsers) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  export const handleUpdate = (colorId) => {
    console.log(`Actualizar color con ID: ${colorId}`);
  };
  
  export const handleDelete = (colorId) => {
    console.log(`Borrar color con ID: ${colorId}`);
  };
  
  export const handleClear = (filterText, setResetPaginationToggle, setFilterText) => {
    if (filterText) {
      setResetPaginationToggle((prevToggle) => !prevToggle);
      setFilterText('');
    }
  };
  
  // Agrega otras funciones según sea necesario
  