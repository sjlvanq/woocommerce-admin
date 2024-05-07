import { Fragment, useEffect, useState } from 'react';
import { useListContext, useUpdate, useRefresh } from 'react-admin';

import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from  '@mui/material/FormControlLabel';
import Grid from  '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import EmptyOrders from './EmptyOrders';

const ListOrderItems = ({ orderStatus, columns, onViewReceiptClick, 
						  onNewOrders, lastOrderId,
						  updateLastOrderId}) => {
  
  const orders = useListContext();
  const [update, { isLoading }] = useUpdate();
  const refresh = useRefresh();
  
  const [isLoadingButtons, setIsLoadingButtons] = useState({});
  const [ordersWithWApp, setOrdersWithWApp] = useState({}); // Sólo on-hold
    
  useEffect(() => {
	  handleNewOrders();
  }, [orders]);
  
  const handleNewOrders = () => {
	  if(orders.data){
	    const currentLastOrderId = orders.data.reduce((max, obj) => obj.id > max ? obj.id : max, 0);
		if(lastOrderId < currentLastOrderId) {
		  const newOrders = orders.data.filter((orden) => orden.id > lastOrderId)
		  updateLastOrderId(currentLastOrderId);
		  onNewOrders(newOrders);
		}
	  }
  }
  
  const handleWAppCheck = (item) => {
	  setOrdersWithWApp(prevState => ({
		  ...prevState,
		  [item.id]: !prevState[item.id]
	  })
	);
  }
  
  const handleUpdateStatusClick = (item) => {
	try {
		const newStatus = orderStatus === 'on-hold' ? 'processing' : 'completed';
		setIsLoadingButtons(prevState => ({
		  ...prevState,
		  [item.id]: true
		}));
		update('orders', { 
			id: item.id, 
			data: { status: newStatus }, 
			previousData: item }, 
            {onSuccess: (data) => {
                refresh();
			}});
		// Mensaje Whatsapp
		const wapp_text_pago = "Hola, " + item.shipping.first_name + ". Hemos aprobado el pago de su pedido a DON GULA. Pronto lo recibirá en " + item.shipping.address_1 + ". Muchas gracias";
		if( newStatus === 'processing' && ordersWithWApp[item.id] ){
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
	  {orders.total > 0 ? (
        orders.data.map(item => (
          <Fragment key={item.id}>
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
							onViewReceiptClick(
								item.meta_data.find(item => item.key === '_receipt_file').value
							)
					}}
					>Ver</Button>}
                </TableCell>
			  ))}
			  {orderStatus !== 'processing' && (
			  <TableCell>
					{isLoadingButtons[item.id] ? 
						<CircularProgress /> :
						<>
						<Button onClick={() => {
							handleUpdateStatusClick(item)
						}}>
							{orderStatus === 'on-hold' && <>Confirmar</>}
							{/* Removido: */}
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
			  )}
            </TableRow>
            <TableRow>
				<TableCell colSpan={columns.length+1}> {/* = columns + 'Acciones' */}
					<Collapse in={true} timeout="auto" unmountOnExit>
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
					</Collapse>
				</TableCell>
			</TableRow>
          </Fragment>
        ))) : (
			<TableRow>
				<TableCell colSpan={columns.length+1}>
					<EmptyOrders status={orderStatus} />
				</TableCell>
			</TableRow>
		)}
    </>
  );
};

export default ListOrderItems;