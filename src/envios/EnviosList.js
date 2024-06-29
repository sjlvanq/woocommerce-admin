import { Box, Typography, Grid, Table, TableContainer, 
TableRow, TableCell, Paper, List, ListItem, ListItemText, ListItemSecondaryAction,
Button, Checkbox, TableBody, TableHead } from '@mui/material';

import { ListBase, Title,
useListContext, ReferenceInput, SelectInput,
required, Form, TimeInput, SaveButton, useGetList, 
CreateBase, WithListContext, useUpdateMany, useUpdate, 
useRefresh, useDelete, useNotify } from 'react-admin';

import { useState, Fragment, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

export const enviosFilters = [
];

const TwoColItemList = ({order}) => {
    return (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List sx={{fontFamily:'monospace', fontSize: 'small'}}>
                  {order.line_items.map((product, index) => (
                    index % 2 === 0 && (
                      <ListItem key={index} sx={{ borderBottom: "1px dotted #bbb"}}>
                        <ListItemText primary={product.name} primaryTypographyProps={{fontFamily:'monospace', fontSize:'small'}} />
                        <ListItemSecondaryAction>{product.quantity}</ListItemSecondaryAction>
                      </ListItem>
                    )
                  ))}
                </List>
              </Grid>
              <Grid item xs={6}>
                <List sx={{fontFamily:'monospace'}}>
                  {order.line_items.map((product, index) => (
                    index % 2 !== 0 && (
                      <ListItem key={index} sx={{ borderBottom: "1px dotted #bbb"}}>
                        <ListItemText primary={product.name} primaryTypographyProps={{fontFamily:'monospace', fontSize:'small'}} />
                        <ListItemSecondaryAction>{product.quantity}</ListItemSecondaryAction>
                      </ListItem>
                    )
                  ))}
                </List>
              </Grid>
            </Grid>
)}

const OrdersUnassigned = ({selectedOrders, onOrderSelection}) => {
    const orders = useListContext();
    //const [expandedRowsOrders, setExpandedRowsOrders] = useState([]);
    const [expandedRowsOrders, setExpandedRowsOrders] = useState([]);
    const handleOrdersRowExpand = (event, orderId) => {
        
        if (expandedRowsOrders.includes(orderId)) {
            setExpandedRowsOrders(expandedRowsOrders.filter(id => id !== orderId));
        } else {
            setExpandedRowsOrders([...expandedRowsOrders, orderId]);
        }
        event.stopPropagation();
    };
    
    return (
    <>
    {orders ? (
		<TableContainer component={Paper}>
		  <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{fontWeight:'bold'}}>
                <TableRow>
                    <TableCell colSpan="1">&nbsp;</TableCell>
                    <TableCell>Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Horario de entrega</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.data &&
                orders.data.map(order => (
                <Fragment key={order.id}>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => handleOrdersRowExpand(e, order.id)}
                      >
                          {expandedRowsOrders.includes(order.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      
                      <TableCell>
                        #{order.id} <br /> 
                        <Checkbox 
                            checked={selectedOrders.includes(order.id) || false}
                            onClick={()=>onOrderSelection(order.id)}
                        />
                      </TableCell>
                      
                      <TableCell sx={{textDecoration:'underline'}}>
                            {order.shipping.first_name}<br />
                            {order.shipping.last_name}
                      </TableCell>
                      
                      <TableCell>
                        {order.shipping.city}<br />
                        {order.shipping.address_1}<br />
                        {order.shipping.address_2}
                      </TableCell>
                      
                      <TableCell>
                        Hora para la que se pide
                      </TableCell>
                      
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={expandedRowsOrders.includes(order.id)} timeout="auto" unmountOnExit>
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <strong>Método de pago</strong>: {order.payment_method_title}
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Total</strong>: {order.total} {order.currency_symbol}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TwoColItemList order={order} />
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </Fragment>
                ))}
            </TableBody>
          </Table>
		</TableContainer>
    ) : (
        <EmptyEnvios lista={1} /> 
    )}
    </>
  );
}

const ListEnviosItems = ({idEnvio}) => {
    const { data, total, isLoading } = useGetList(
        'envios/orders/'+idEnvio,
    );
    const [update] = useUpdate();
	const [isRemovingItems, setIsRemovingItems] = useState([]);
    const refresh = useRefresh();
    const handleClickRemove = (idOrder) => {
        setIsRemovingItems([...isRemovingItems, idOrder]);
        update(
            'orders', {
                id: idOrder, 
                data: { 'meta_data': [{key : '_envio_id', value: -1}]}
            },
            {onSuccess: (data) => {
                refresh();
                setIsRemovingItems(isRemovingItems.filter(id => id !== idOrder));
            }}
        )
    };
    const [deleteOne] = useDelete();
    const handleClickDelete = (idEnvio) => {
        deleteOne(
            'envios',
            {id: idEnvio},
            {onSuccess: () => {
                console.log("onSuccess de delete");
                refresh();
            },
            onError: (error) => {
                console.log("error");
                console.log(error);
            }
            }
        )
    }
    useEffect(()=>setIsRemovingItems([]),[]);
    return (
        <>
        {isLoading ? (
            <LinearProgress />
        ) : ( total > 0 ? (
        <TableContainer>
            <Table>
                <TableBody>
                {data.map(order => (
                    <TableRow key={order.id}>
                        <TableCell>
                            Pedido #{order.id}
                        </TableCell>
                        <TableCell>
                            {order.shipping.first_name}<br />
                            {order.shipping.last_name}
                        </TableCell>
                        <TableCell>
                            {order.shipping.city}<br />
                            {order.shipping.address_1}<br />
                            {order.shipping.address_2}
                        </TableCell>
                        <TableCell>
                            Hora para la que se pide
                        </TableCell>
                        <TableCell>
                            {isRemovingItems.includes(order.id) ? <CircularProgress /> : (
                            <Button
                                onClick={ () => {
                                    handleClickRemove(order.id)
                                }}
                            >Quitar</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        ) : (
        <Box textAlign="center" m={1} sx={{color:'#aaa'}}>
            <Grid container 
                direction="row"
                justifyContent="center"
                alignItems="center"
                columnSpacing={2}
            >
            <Grid item>
                <Typography variant="body">
                    ¡Sin pedidos asignados al envío #{idEnvio}!
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="body">
                    <Button onClick={()=>handleClickDelete(idEnvio)}>Borrar</Button>
                </Typography>
            </Grid>
            </Grid>
        </Box>
        ))}
        </>
    )
}

const ListEnvios = ({onSelectEnvio, selectedEnvio, unassignedEmpty }) => {
    const envios = useListContext();
    const [expandedRowsEnvios, setExpandedRowsEnvios] = useState([]);
    const handleEnviosRowExpand = (event, envioId) => {
        if (expandedRowsEnvios.includes(envioId)) {
            setExpandedRowsEnvios(expandedRowsEnvios.filter(id => id !== envioId));
        } else {
            setExpandedRowsEnvios([...expandedRowsEnvios, envioId]);
        }
        event.stopPropagation();
    };
	
    const [isDeletingEnvios, setIsDeletingEnvios] = useState([]);
    const [deleteOne] = useDelete();
    const handleClickDelete = (idEnvio) => {
        setIsDeletingEnvios([...isDeletingEnvios, idEnvio]);
        deleteOne(
            'envios',
            {id: idEnvio},
            {onSuccess: () => {
                onSelectEnvio(null);
                refresh();
                setIsDeletingEnvios(isDeletingEnvios.filter(id => id !== idEnvio));
            }}
        )
    }
    const refresh = useRefresh();
    return (
        <>
        {envios.data &&
        envios.data.map(envio => (
          <Fragment key={envio.id}>
              <TableRow onClick={() => onSelectEnvio(envio)}>
                <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={(e) => handleEnviosRowExpand(e, envio.id)}
                >
                    {expandedRowsEnvios.includes(envio.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>
                    {!unassignedEmpty && (
                    <input type="radio" name="enviosRadio" 
                      value="{envio.id}" 
                      checked={selectedEnvio && selectedEnvio.id === envio.id} 
                      onClick={()=>onSelectEnvio(envio.id)}
                      onChange={()=>(false)}
                    />
                    )}
                    #{envio.id}
                </TableCell>
                <TableCell>
                    {envio.repartidor}
                </TableCell>
                <TableCell>
                    {envio.horario_salida}
                </TableCell>
                <TableCell>
                    {isDeletingEnvios.includes(envio.id)? <CircularProgress /> :
                    <Button onClick={()=>handleClickDelete(envio.id)}>Desarmar</Button>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={expandedRowsEnvios.includes(envio.id)} timeout="auto" unmountOnExit>
                        <ListEnviosItems idEnvio={envio.id} />
                    </Collapse>
                </TableCell>
            </TableRow>
          </Fragment>
        ))}
        </>
    );
}
const EnviosPanel = () => {
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedEnvio, setSelectedEnvio] = useState(false);
    const refresh = useRefresh();
    const [updateMany, {isLoading:isAdding}] = useUpdateMany();
    const { total:unassigned_total } = useGetList('envios/orders/-1');
    const unassigned_empty = unassigned_total > 0 ? false : true;
    const notify = useNotify();
    
    const handleOrderSelection = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };
    
    const transformCreateEnvio = data => ({
        ...data,
        orders: selectedOrders
    });
    
    const handleSelectEnvio = (envio) => {
        setSelectedEnvio(envio);
    };
    
    const handleClickAdd = () => {
        updateMany(
            'orders',
            {
                ids: selectedOrders, 
                data: { 'meta_data': [{key : '_envio_id', value: selectedEnvio.id}]}
            },
            {onSuccess: (data) => {
                refresh();
                setSelectedOrders([]);
            }}
        );
    };
    
    const onCreateEnvio = data => {
        notify("Nuevo envío programado");
        setSelectedOrders([]);
        refresh();
    };
    
    return (
    <>
    <Title defaultTitle="Envíos" />
    {!unassigned_empty &&
    <>
    
    <Box textAlign="left">
        <Typography>Programar envío</Typography>
    </Box>
    <ListBase>
        <CreateBase transform={transformCreateEnvio} redirect={false}>
        <Form>
        <Grid container spacing={2} direction="row" justifyContent='center' alignItems='center' >
            <Grid item md={5} xs={12}>
                <ReferenceInput source="repartidor" reference="repartidores">
                    <SelectInput 
                        optionText="nombre" 
                        source="repartidores"
                        label="Repartidor"
                        validate={required()}
                        fullWidth
                        onChange={() => true}
                        /*parse={(date: Date) => (date ? date.toISOString() : null)}*/
                    />
                </ReferenceInput>
            </Grid>
            <Grid item md={3} xs={12}>
                <TimeInput 
                    source="horario_salida" 
                    fullWidth
                    label="Horario de salida"
                    onChange={() => true}
                />
            </Grid>
            <Grid item md={4} xs={12}>
                <SaveButton type="button" label="Programar envío" 
                    disabled={selectedOrders.length === 0} 
                    mutationOptions={{onSuccess:onCreateEnvio}}
                    />
            </Grid>
        </Grid>
        </Form>
        </CreateBase>
    </ListBase>
    
    <ListBase resource="envios/orders/-1" empty={<EmptyEnvios lista={0} />}>
        <OrdersUnassigned selectedOrders={selectedOrders} onOrderSelection={handleOrderSelection} />
    </ListBase>
    
    <Form>
    <Grid sx={{mt:1}} container spacing={2} direction="row" justifyContent='center' alignItems='center' >
        <Grid item md={5} xs={12}>            
            {isAdding ? <CircularProgress /> : (
            <Button
                disabled={!selectedEnvio || !selectedOrders.length > 0}
                onClick={ () => {
                    handleClickAdd()
                }}
            >
                Añadir al envío seleccionado
            </Button>)}
        </Grid>
        <Grid item md={4} xs={12}>
            {selectedEnvio ? ( 
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            {!unassigned_empty && 
                                <TableCell>Envío #{selectedEnvio.id}</TableCell>
                            }
                            <TableCell>{selectedEnvio.repartidor}</TableCell>
                            <TableCell>{selectedEnvio.horario_salida}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            ) : <Typography sx={{color:'#ccc'}}>(Ningún envío seleccionado)</Typography>}
        </Grid>
    </Grid>
    </Form>    
    </>
    }
    
    <Box textAlign="left" sx={{marginTop:'1em'}} component={'div'}>
        <Typography component={"span"}>Envíos programados</Typography>
    </Box>
    
    <ListBase resource="envios">
    <WithListContext render={ ({total}) => 
      ( ( total > 0 ) ? (
      <TableContainer component={Paper} sx={{marginBottom:"3em"}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{fontWeight:'bold'}}>
                <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>Envío</TableCell>
                    <TableCell>Repartidor</TableCell>
                    <TableCell>Horario de salida</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <ListEnvios onSelectEnvio={handleSelectEnvio} selectedEnvio={selectedEnvio} unassignedEmpty={unassigned_empty} />
            </TableBody>
          </Table>
      </TableContainer>
      ) : (<EmptyEnvios lista={1}/>))
    } />
    </ListBase>
    </>
    );
};

const EmptyEnvios = ({lista}) => {
    const EmptyEnviosVars = [
        {leyenda: 'No existen pedidos sin asignar', icon: <HourglassDisabledIcon sx={{fontSize:'3em'}} />},
        {leyenda: 'Sin envíos programados', icon: <HourglassDisabledIcon sx={{fontSize:'3em'}} />}
    ];
    return (
    <Box textAlign="center" m={1} sx={{color:'#aaa'}}>
        <Grid container 
			direction="row"
			justifyContent="center"
			alignItems="center"
			columnSpacing={2}
		>
		<Grid item>
		<Typography variant="body">
			{EmptyEnviosVars[lista].icon}
        </Typography>
        </Grid>
		<Grid item>
		<Typography variant="body" paragraph>
            {EmptyEnviosVars[lista].leyenda}
        </Typography>
		</Grid>
		</Grid>
    </Box>
)};

export default EnviosPanel;