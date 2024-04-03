import { useEffect, useState } from 'react';
import { Grid, Typography, Button} from "@mui/material";
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

import { Labeled, ListBase, Datagrid, TextField, ReferenceManyField, SimpleList, 
useRecordContext, useListContext, useUpdate, useGetList } from "react-admin";
import { Call, Place } from "@mui/icons-material";

const ListOrderItems = ({ orderStatus, columns, onViewReceiptClick, onOrderStatusUpdate, isOrderStatusUpdating}) => {
  const orders = useListContext();
  const [update, { isLoading, error }] = useUpdate();
  const [isLoadingButtons, setIsLoadingButtons] = useState({});
  useEffect(() => {
	  //console.log("useEffect isOrderStatusUpdating "+orderStatus+" con valor "+(isOrderStatusUpdating?"verdadero":"falso"));
	  orders.refetch();
  }, [isOrderStatusUpdating]);
  useEffect(() => {
	  //console.log("useEffect isLoading "+orderStatus+" con valor "+(isLoading?"verdadero":"falso"));
	  onOrderStatusUpdate();
  }, [isLoading]);
  const handleUpdateStatusClick = async (item) => {
	try {
		const newStatus = orderStatus === 'on-hold' ? 'processing' : 'completed';
		setIsLoadingButtons(prevState => ({
		  ...prevState,
		  [item.id]: true
		}));
		await update('orders', { id: item.id, data: { status: newStatus }, previousData: item });
	} finally {
		setIsLoadingButtons(prevState => ({
			...prevState,
			[item.id]: true
		}));
	}
  }
  return (
    <>
      {orders.data &&
        orders.data.map(item => (
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
				  {column.key === 'payment_method_title' && <>{item.payment_method_title}</>}
                  {column.key === 'total' && (
                    <>S/ {item.total}</>
                  )}
				  {column.key === 'receipt' && 
					<Button onClick={
						() => {
							//console.log(item);
							onViewReceiptClick(
								item.meta_data.find(item => item.key === '_receipt_file').value
							)
					}}
					>Ver</Button>}
                </TableCell>
			  ))}
			  <TableCell>
					{isLoadingButtons[item.id] ? 
						<CircularProgress /> :
						<Button onClick={() => {
							handleUpdateStatusClick(item)
						}}>
							{orderStatus === 'on-hold' && <>Confirmar</>}
							{orderStatus === 'processing' && <>Listo para la entrega</>}
						</Button>
					}
			  </TableCell>
            </TableRow>
            {item.line_items.map(product => (
              <React.Fragment key={product.id}>
                <TableRow sx={{backgroundColor:'#eee'}}>
                  <TableCell colSpan={columns.length+1}> {/* columns + 'Acciones' */}
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

const ListOrders = ({label, orderStatus, columns, onViewReceiptClick, isOrderStatusUpdating, onOrderStatusUpdate }) => {	
  return (
	<ListBase resource={"orders"} filter={{status: orderStatus}} queryOptions={{ refetchInterval: 5000 }} >
		<Labeled label={label} fullWidth sx={{ '& .RaLabeled-label': {textAlign:'left'} }}>
			<TableContainer component={Paper}>
			  <Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead sx={{backgroundColor:'#dde'}}>
				  <TableRow>
					{columns.map((column, idx) => (
					<TableCell key={idx} align={'center'}>
						{column.label}
					</TableCell>
					))}
					<TableCell>
						Acciones
					</TableCell>
				  </TableRow>
				</TableHead>
				<TableBody>
					<ListOrderItems 
						orderStatus={orderStatus} 
						columns={columns} 
						onViewReceiptClick={onViewReceiptClick} 
						onOrderStatusUpdate={onOrderStatusUpdate}
						isOrderStatusUpdating={isOrderStatusUpdating}
					/>
				</TableBody>
			  </Table>
			</TableContainer>
		</Labeled>
	</ListBase>
  )};

const Dashboard = () => {
	const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
	const [receiptSrc, setReceiptSrc] = useState('');
	const [isOrderStatusUpdating, setIsOrderStatusUpdating] = useState(false);
	const handleOrderStatusUpdate = () => {
		setIsOrderStatusUpdating(!isOrderStatusUpdating);
	}
	
	const handleReceiptViewerOpen = (src) => {
		setReceiptSrc(src);
		setReceiptViewerOpen(true);
	}
	const handleReceiptViewerClose = (reason) => {
		setReceiptViewerOpen(false);
	}
	return (
	<>
	<Modal
	  open={receiptViewerOpen}
	  onClose={handleReceiptViewerClose}
      style={{
        display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
      }}
	>
		<Box 
			component="img"
			src={receiptSrc} 
			style={{maxWidth:'70%', height: '100%'}}
		/>
	</Modal>
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
						{key:'phone', label: 'Teléfono', align: 'center'},
						{key:'total', label: 'Total pedido', align: 'right'},
						{key:'receipt', label: 'Comprobante', align: 'center'},
					]}
					onViewReceiptClick={(src) => handleReceiptViewerOpen(src)}
					onOrderStatusUpdate={handleOrderStatusUpdate}
					isOrderStatusUpdating={isOrderStatusUpdating}
				/>
			</Grid>
			<Grid item>
				<ListOrders 
					label="Pedidos para entregar" 
					orderStatus="processing" 
					columns={[
						{key:'name', label: 'Nombre'},
						{key:'address', label: 'Dirección', align: 'right'},
						{key:'phone', label: 'Teléfono', align: 'center'},
						{key:'payment_method_title', label: 'Método de pago', align: 'center'},
					]}
					onOrderStatusUpdate={handleOrderStatusUpdate}
					isOrderStatusUpdating={isOrderStatusUpdating}
				/>
			</Grid>
		</Grid>
	</Grid>
	</>
)};

export default Dashboard;