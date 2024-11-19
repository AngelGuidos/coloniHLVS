import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './table.css';


export default function DataGridDemo({ rows, columns }) {
  return (
    <Box sx = {{}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableColumnResize={true} 
        disableRowSelectionOnClick={true}
        autoHeight={true} 
        autowidth={true} // Si alguien utiliza esta cosa para el ancho de la tabla tenga en cuenta que, 
        //tambien puede configurar el ancho de las columnas desde el objeto columns o desde el contenedor Box
        disableColumnSorting={true}
      />
    </Box>
  );
}
