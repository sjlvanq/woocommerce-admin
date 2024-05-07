import React from 'react';
import { useState } from 'react';
import { useStore } from 'react-admin';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import ListOrders from './dashboard/ListOrders';

const Dashboard = () => {
	const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
	const [receiptSrc, setReceiptSrc] = useState('');
	
	const [newOrders, setNewOrders] = useState([]);
	const [lastOrderId, setLastOrderId] = useStore('orders.lastOrderId', 0);
	const [newOrdersNotification, setNewOrdersNotification] = useStore('orders.newOrdersNotification', false);
	
	const handleReceiptViewerOpen = (src) => {
		setReceiptSrc(src);
		setReceiptViewerOpen(true);
	}
	const handleReceiptViewerClose = (reason) => {
		setReceiptViewerOpen(false);
	}
	const handleNewOrders = (orders) => {
		setNewOrders(newOrders.concat(orders));
	}
	const handleNewOrdersModalClose = () => {
		setNewOrders([]);
		setNewOrdersNotification(false);
	}
	const handleNewCodOrderSendWapp = function (order){
		const wapp_text_pago = "Hola, " + order.shipping.first_name + ". DON GULA ha recibido su pedido y pronto lo estaremos enviando a " + order.shipping.address_1 + ". Muchas gracias";
		window.open('https://web.whatsapp.com/send/?phone=' + order.shipping.phone + '&text=' + wapp_text_pago + '&type=phone_number&app_absent=1', '_blank');
	}
	const updateLastOrderId = (newLastId) => {
		setLastOrderId(newLastId);
	}
	
	return (
	<>
	<Modal
	  open={newOrders.length > 0}
      style={{
        display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
      }}
	>
		<Card>
			<CardContent>
			  <Typography variant="h5" color="text.primary" gutterBottom>
				¡Nuevos pedidos! ({newOrders.length})
			  </Typography>
  			  <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
			    <Table aria-label="Nuevos pedidos" stickyHeader>
				  <TableHead sx={{backgroundColor:'#dde'}}>
				    <TableRow>
					  <TableCell>Cliente</TableCell>
					  <TableCell>Compra</TableCell>
					  <TableCell>Método de pago</TableCell>
				    </TableRow>
				  </TableHead>
				  <TableBody>
				  {newOrders.length > 0 && newOrders.map(item => (
				    <TableRow key={item.id}>
					  <TableCell>{item.shipping.first_name} {item.shipping.last_name}</TableCell>
					  <TableCell>S/ {item.total}</TableCell>
					  <TableCell>
						{item.payment_method_title}
						{item.payment_method === 'cod' &&
						<>
							<br />
							<Button size="small" onClick={
								() => handleNewCodOrderSendWapp(item)
							}
							>Enviar WApp</Button>
						</>
						}
					  </TableCell>
				    </TableRow>
				  ))}
				  </TableBody>
			    </Table>
			  </TableContainer>
			</CardContent>
			<Divider />
			<CardActions>
			  <Button onClick={handleNewOrdersModalClose}>Aceptar</Button>
			</CardActions>
		</Card>
	</Modal>
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
		<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}}>
			<Grid item>
				<ListOrders 
                    label={
                        <>
                            <Typography>Pedidos para confirmar cancelación</Typography>
                            <Typography sx={{fontSize:'small'}}>Pedidos pagados por transferencia</Typography>
                        </>
                    }
					orderStatus="on-hold" 
					columns={[
						{key:'name', label: 'Nombre'},
						{key:'phone', label: 'Teléfono', align: 'center'},
						{key:'total', label: 'Total pedido', align: 'right'},
						{key:'receipt', label: 'Comprobante', align: 'center'},
					]}
					onViewReceiptClick={(src) => handleReceiptViewerOpen(src)}
					onNewOrders={handleNewOrders}
					lastOrderId={lastOrderId}
					updateLastOrderId={updateLastOrderId}
				/>
			</Grid>
			<Grid item sx={{marginTop:'1em'}}>
				<ListOrders 
                    label={
                        <>
                            <Typography>Pedidos en preparación</Typography>
                            <Typography sx={{fontSize:'small'}}>
                                Pago en efectivo o transferencia verificada
                            </Typography>
                        </>
                    }
					orderStatus="processing" 
					columns={[
						{key:'name', label: 'Nombre'},
						{key:'address', label: 'Dirección', align: 'right'},
						{key:'phone', label: 'Teléfono', align: 'center'},
						{key:'payment_method_title', label: 'Método de pago', align: 'center'},
					]}
					onNewOrders={handleNewOrders}
					lastOrderId={lastOrderId}
					updateLastOrderId={updateLastOrderId}
				/>
			</Grid>
		</Grid>
	</Grid>
	</>
)};

export default Dashboard;