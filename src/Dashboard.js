import { useEffect, useState } from 'react';
import { Grid, Typography, Button, Checkbox, FormControlLabel, Divider } from "@mui/material";
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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';

import { Labeled, ListBase, Datagrid, TextField, ReferenceManyField, SimpleList, 
useRecordContext, useListContext, useUpdate, useGetList } from "react-admin";
import { Call, Place } from "@mui/icons-material";

const ListOrderItems = ({ orderStatus, columns, onViewReceiptClick, 
						  onOrderStatusUpdate, isOrderStatusUpdating,
						  onNewOrders}) => {
  const orders = useListContext();
  const [update, { isLoading, error }] = useUpdate();
  const [isLoadingButtons, setIsLoadingButtons] = useState({});
  const [ordersWithWApp, setOrdersWithWApp] = useState({}); // Sólo on-hold
  const [prevLastOrderId, setPrevLastOrderId] = useState(0);
  useEffect(() => {
	  //Recibe señal de que la otra tabla se está actualizando
	  //console.log("useEffect isOrderStatusUpdating "+orderStatus+" con valor "+(isOrderStatusUpdating?"verdadero":"falso"));
	  orders.refetch();
  }, [isOrderStatusUpdating]);
  useEffect(() => {
	  //Hace llegar a la otra tabla la señal de actualización
	  //console.log("useEffect isLoading "+orderStatus+" con valor "+(isLoading?"verdadero":"falso"));
	  onOrderStatusUpdate();
  }, [isLoading]);
  useEffect(() => {
	  //Comprueba si hay pedidos nuevos
	  if(orders.data){
	  //Obtener el valor más alto para orders.data[].id
	    const currentLastOrderId = orders.data.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
	    if(prevLastOrderId===0){
	      //Omite la actualización inicial (carga)
	      setPrevLastOrderId(currentLastOrderId);
	    } else if(prevLastOrderId < currentLastOrderId) {
		  const nuevasOrdenes = orders.data.filter((orden) => orden.id > prevLastOrderId)
		  setPrevLastOrderId(currentLastOrderId);
		  onNewOrders(nuevasOrdenes);
		}
	    //console.log(orders);
	  }
  }, [orders]);
  const handleWAppCheck = (item) => {
	  setOrdersWithWApp(prevState => ({
		  ...prevState,
		  [item.id]: !prevState[item.id]
	  })
	);
  }
  const handleUpdateStatusClick = async (item) => {
	try {
		const newStatus = orderStatus === 'on-hold' ? 'processing' : 'completed';
		setIsLoadingButtons(prevState => ({
		  ...prevState,
		  [item.id]: true
		}));
		await update('orders', { id: item.id, data: { status: newStatus }, previousData: item });
		// Mensaje Whatsapp
		const wapp_text_pago = "Hola, " + item.shipping.first_name + ". Hemos aprobado el pago de su pedido a DON GULA. Pronto lo recibirá en " + item.shipping.address_1 + ". Muchas gracias";
		if( newStatus === 'processing' && ordersWithWApp[item.id] ){
			//https://web.whatsapp.com/send/?phone=93813351309&text=Hola%2C+Silvano+Emanuel.+Hemos+aprobado+el+pago+de+su+pedido+a+DON+GULA.+Pronto+lo+recibir%C3%A1+en+Ricardo+Palma+181.+Muchas+gracias&type=phone_number&app_absent=0
			window.open('https://web.whatsapp.com/send/?phone=' + item.shipping.phone + '&text=' + wapp_text_pago + '&type=phone_number&app_absent=1', '_blank');
		}
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
						<>
						<Button onClick={() => {
							handleUpdateStatusClick(item)
						}}>
							{orderStatus === 'on-hold' && <>Confirmar</>}
							{orderStatus === 'processing' && <>Listo para la entrega</>}
						</Button>
						{orderStatus === 'on-hold' 
							&& item.meta_data.find(meta => meta.key === '_whatsapp')
							&& item.meta_data.find(meta => meta.key === '_whatsapp').value === 'no'
							&& 	<>
								(&nbsp;<FormControlLabel 
									control={
										<Checkbox
											checked={ordersWithWApp[item.id]||false}
											onChange={()=>handleWAppCheck(item)}
											sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }} />
									} 
									label={<Typography sx={{ fontSize: 12 }}>WhatsApp</Typography>}
								/>&nbsp;)
								</>
						}
						</>
					}
			  </TableCell>
            </TableRow>
            <TableRow sx={{backgroundColor:'#eee'}}>
				<TableCell colSpan={columns.length+1}> {/* = columns + 'Acciones' */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <List dense>
              {item.line_items.map((product, index) => (
                index % 2 === 0 && (
                  <ListItem key={index} sx={{ borderBottom: "1px dotted #bbb" }}>
                    <ListItemText primary={product.name} />
                    <ListItemSecondaryAction>{product.quantity}</ListItemSecondaryAction>
                  </ListItem>
                )
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <List dense>
              {item.line_items.map((product, index) => (
                index % 2 !== 0 && (
                  <ListItem key={index} sx={{ borderBottom: "1px dotted #bbb" }}>
                    <ListItemText primary={product.name} />
                    <ListItemSecondaryAction>{product.quantity}</ListItemSecondaryAction>
                  </ListItem>
                )
              ))}
            </List>
          </Grid>
        </Grid>
				</TableCell>
			</TableRow>
          </React.Fragment>
        ))}
    </>
  );
};

const ListOrders = ({label, orderStatus, columns, onViewReceiptClick, 
					 isOrderStatusUpdating, onOrderStatusUpdate,
					 onNewOrders
					}) => {
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
						onNewOrders={onNewOrders}
					/>
				</TableBody>
			  </Table>
			</TableContainer>
		</Labeled>
	</ListBase>
  )};

const Dashboard = () => {
	const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
	const [newOrders, setNewOrders] = useState([]);
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
	const handleNewOrders = (orders) => {
		setNewOrders(newOrders.concat(orders));
	}
	const handleNewOrdersModalClose = () => {
		setNewOrders([]);
	}
	const handleNewCodOrderSendWapp = function (order){
		const wapp_text_pago = "Hola, " + order.shipping.first_name + ". DON GULA ha recibido su pedido y pronto lo estaremos enviando a " + order.shipping.address_1 + ". Muchas gracias";
		window.open('https://web.whatsapp.com/send/?phone=' + order.shipping.phone + '&text=' + wapp_text_pago + '&type=phone_number&app_absent=1', '_blank');
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
		<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}} sx={{mt:2}}>
				<Grid item><Typography variant="h4" color="gray">DON GULA</Typography></Grid>
				<Grid item><Typography variant="h5" color="gray">Gestión del aplicativo</Typography></Grid>
		</Grid>
		<Grid container direction="column" justifyContent="center" style={{textAlign:"center"}}>
			<Grid item>
				<ListOrders 
                    label={
                        <>
                            <Typography variant="h6">Pedidos para confirmar cancelación</Typography>
                            <Typography>Pedidos pagados por transferencia</Typography>
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
					onOrderStatusUpdate={handleOrderStatusUpdate}
					isOrderStatusUpdating={isOrderStatusUpdating}
					onNewOrders={handleNewOrders}
				/>
			</Grid>
			<Grid item sx={{marginTop:'1em'}}>
				<ListOrders 
                    label={
                        <>
                            <Typography variant="h6">Pedidos para entregar</Typography>
                            <Typography>
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
					onOrderStatusUpdate={handleOrderStatusUpdate}
					isOrderStatusUpdating={isOrderStatusUpdating}
					onNewOrders={handleNewOrders}
				/>
			</Grid>
		</Grid>
	</Grid>
	</>
)};

export default Dashboard;