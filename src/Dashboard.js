import { Grid, Typography} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import React from 'react';

import { Labeled, ListBase, Datagrid, TextField, ReferenceManyField, SimpleList, useRecordContext, useListContext } from "react-admin";
import OrderShowProducts from "./orders/OrderShowProducts";
import { Call, Place } from "@mui/icons-material";

const ListOrderItems = ({ columns }) => {
  const order = useListContext();
  return (
    <>
      {order.data &&
        order.data.map(item => (
          <React.Fragment key={item.id}>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((column, idx) => (
                <TableCell
                  key={idx}
                  align={column.align || 'left'}
                >
                  {column.key === 'name' && (
                    <Box sx={{ textTransform: 'uppercase' }}>
                      {item.shipping.first_name} {item.shipping.last_name}
                    </Box>
                  )}
                  {column.key === 'address' && (
                    <>{item.shipping.address_1} {item.shipping.address_2}</>
                  )}
                  {column.key === 'phone' && <>{item.shipping.phone}</>}
                  {column.key === 'total' && (
                    <>S/ {item.total}</>
                  )}
                  {column.key === 'actions' ? <TableCell align="right">Acciones</TableCell> : null}
                </TableCell>
              ))}
            </TableRow>
            {item.line_items.map(product => (
              <React.Fragment key={product.id}>
                <TableRow sx={{backgroundColor:'#eee'}}>
                  <TableCell colSpan={columns.length}>
					  &bull;&nbsp;{product.name} x {product.quantity} 
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
    </>
  );
};


{/*
const ListOrderItems = ({columns}) => {
	const order = useListContext();
	return (
		<>
			{order.data && 
			order.data.map(item => 
					<TableRow
					  key={item.id}
					  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
					>
						{columns.map((column, idx) => (
						  <TableCell
							key={idx}
							align={column.align || 'left'}
						  >
							{column.key === 'name' && (
							  <Box sx={{ textTransform: 'uppercase' }}>
								{item.shipping.first_name} {item.shipping.last_name}
							  </Box>
							)}
							{column.key === 'address' && (
							  <>{item.shipping.address_1} {item.shipping.address_2}</>
							)}
							{column.key === 'phone' && <>{item.shipping.phone}</>}
							{column.key === 'total' && (
							  <>S/ {item.total}</>
							)}
							{column.key === 'actions' && <>Acciones</>}
						  </TableCell>
						)}
					</TableRow>
					{item.line_items.map(product =>
						<TableRow>
							<TableCell colSpan={columns.length}>
								{product.name} x {product.quantity} 
							</TableCell>
						</TableRow>
					)}
				)}
		</>
	);
};
*/}

const ListOrders = ({label, orderStatus, columns}) => {
  const orders = useListContext();
  return (
	<ListBase resource={"orders"} filter={{status: orderStatus}}>
		<Labeled label={label} fullWidth sx={{ '& .RaLabeled-label': {textAlign:'left'} }}>
			<TableContainer component={Paper}>
			  <Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead sx={{backgroundColor:'#dde'}}>
				  <TableRow>
					{columns.map((column, idx) => (
					<TableCell key={idx} align={column.align || 'left'}>
						{column.label}
					</TableCell>
					))}
				  </TableRow>
				</TableHead>
				<TableBody>
					<ListOrderItems columns={columns} />
				</TableBody>
			  </Table>
			</TableContainer>
		</Labeled>
	</ListBase>
  )};

const Dashboard = () => (
	<Grid container direction="row" justifyContent="center">
		<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}} sx={{mt:2}}>
				<Grid item><Typography variant="h4" color="gray">DON GULA</Typography></Grid>
				<Grid item><Typography variant="h5" color="gray">Gestión del aplicativo</Typography></Grid>
		</Grid>
		<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}}>
			<Grid item>
				<ListOrders 
					label="Pedidos para confirmar cancelación" 
					orderStatus="on-hold" 
					columns={[
						{key:'name', label: 'Nombre'},
						{key:'phone', label: 'Teléfono', align: 'right'},
						{key:'total', label: 'Total pedido', align: 'right'}
					]}
				/>
			</Grid>
			<Grid item>
				<ListOrders 
					label="Pedidos para entregar" 
					orderStatus="processing" 
					columns={[
						{key:'name', label: 'Nombre'},
						{key:'address', label: 'Dirección', align: 'right'},
						{key:'phone', label: 'Teléfono', align: 'right'}					]} 
				/>
			</Grid>
		</Grid>
	</Grid>
);

export default Dashboard;