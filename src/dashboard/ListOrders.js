import React from 'react';
import { ListBase } from "react-admin";

import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import ListOrderItems from './ListOrderItems';

const ListOrders = ({label, orderStatus, columns, onViewReceiptClick, 
					 onNewOrders, lastOrderId, updateLastOrderId
					}) => {
  return (
	<ListBase resource={"orders"} filter={{status: orderStatus}}  queryOptions={{ refetchInterval: 7000 }} >
			<Box textAlign="left">
				{label}
			</Box>
			<TableContainer component={Paper}>
			  <Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
				  <TableRow>
					{columns.map((column, idx) => (
					<TableCell key={idx} align={'center'}>
						{column.label}
					</TableCell>
					))}
					{orderStatus !== "processing" && (
					<TableCell>
						Acciones
					</TableCell>
					)}
				  </TableRow>
				</TableHead>
				<TableBody>
					<ListOrderItems 
						orderStatus={orderStatus} 
						columns={columns} 
						onViewReceiptClick={onViewReceiptClick}
						onNewOrders={onNewOrders}
						lastOrderId={lastOrderId}
						updateLastOrderId={updateLastOrderId}
					/>
				</TableBody>
			  </Table>
			</TableContainer>
	</ListBase>
  )};
  
export default ListOrders;