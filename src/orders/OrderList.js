import { Fragment, useCallback } from 'react';
import { 
    Datagrid,
    List, 
    TextInput, 
    TextField, 
    useGetList, 
    useListContext, 
    FunctionField,
    BulkUpdateButton,
    TopToolbar,
    FilterButton,
} from 'react-admin';
import OrderShow from './OrderShow';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const processing = { status: "processing" };
const completed = { status: "completed" };

const ChangeStatusButtonProcessing = () => (<BulkUpdateButton label="En preparación" data={processing} icon={<AccessTimeIcon/>} />);
const ChangeStatusButtonCompleted = () => (<BulkUpdateButton label="Completado" data={completed} icon={<AssignmentTurnedInIcon/>} />);

const StatusProcessing = () => (<ChangeStatusButtonProcessing />);
const StatusCompleted = () => (<ChangeStatusButtonCompleted />);

const OrderList = () => (
    <List 
        actions={<ListActions />}
        filters={orderFilters}
        filterDefaultValues={{ status: 'processing' }}
        sort={{ order: 'desc' }}
        queryOptions={{ refetchInterval: 3000 }}
    >
        <TabbedDatagrid />
    </List>
);

const ListActions = () => (
    <TopToolbar>
        <FilterButton label="Filtros" />
    </TopToolbar>
);

const orderFilters = [<TextInput source="search" alwaysOn label="Buscar" />];

const tabs = [
    { id: 'on-hold', name: 'Pendiente de pago' },
    { id: 'processing', name: 'En preparación' },
    { id: 'completed', name: 'Completado' },
];

const useGetTotals = (filterValues) => {
    const { total: totalonhold } = useGetList('orders', {
        filter: { ...filterValues, status: 'on-hold' },
    });
    const { total: totalprocessing } = useGetList('orders', {
        filter: { ...filterValues, status: 'processing' },
    });
    const { total: totalcompleted } = useGetList('orders', {
        filter: { ...filterValues, status: 'completed' },
    });
    return {
        processing: totalprocessing,
        onHold: totalonhold,
        completed: totalcompleted,
    };
};

const CustomEmpty = () => (<Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">Sin pedidos</Typography>)

const TabbedDatagrid = () => {
    const dateSettings = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const totals = useGetTotals(filterValues);
    const handleChange = useCallback(
        (event, value) => {
        setFilters &&
            setFilters (
                { ...filterValues, status: value }, 
                displayedFilters, 
                false
            );
        }, 
        [displayedFilters, filterValues, setFilters]
    );

    return (
        <Fragment>
            <Tabs
                variant='fullWidth'
                centered
                value={filterValues.status}
                indicatorColor='primary'
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            totals[choice.name]
                                ? `${choice.name} (${totals[choice.name]})`
                                : choice.name}
                            value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {filterValues.status === 'on-hold' && (
                <Datagrid rowClick='edit' empty={<CustomEmpty />} expand={<OrderShow />} bulkActionButtons={<StatusProcessing />}>
                    <TextField 
                        source="id" 
                        label="Pedido"
                    />
                    <FunctionField 
                        label="Fecha"
                        render={record => `${new Date(record.date_created).toLocaleDateString('es-ES', dateSettings)}`}
                    />
                    <FunctionField 
                        label="Cliente"
                        render={record => `${record.billing.first_name} ${record.billing.last_name}`} />
                    <FunctionField 
                        label="Productos"
                        render={record => `${record.line_items.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)} item`}
                    />
                    <FunctionField 
                        label="Total" 
                        sx={{ fontWeight: 'bold' }} 
                        render={record => `${record.total} ${record.currency_symbol}`} 
                        textAlign="right"
                    />
                </Datagrid>
            )}
            {filterValues.status === 'processing' && (
                <Datagrid optimized rowClick='edit' expand={<OrderShow />} empty={<CustomEmpty />} bulkActionButtons={<StatusCompleted />}>
                    <TextField 
                        source="id" 
                        label="Pedido"
                    />
                    <FunctionField 
                        label="Fecha"
                        render={record => `${new Date(record.date_created).toLocaleDateString('es-ES', dateSettings)}`}
                    />
                    <FunctionField 
                        label="Cliente"
                        render={record => `${record.billing.first_name} ${record.billing.last_name}`} />
                    <FunctionField 
                        label="Productos"
                        render={record => `${record.line_items.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)} item`}
                    />
                    <FunctionField 
                        label="Total" 
                        sx={{ fontWeight: 'bold' }} 
                        render={record => `${record.total} ${record.currency_symbol}`} 
                        textAlign="right"
                    />
                </Datagrid>
            )}
            {filterValues.status === 'completed' && (
                <Datagrid rowClick='edit' empty={<CustomEmpty />} expand={<OrderShow />}>
                    <TextField 
                        source="id" 
                        label="Pedido"
                    />
                    <FunctionField 
                        label="Fecha"
                        render={record => `${new Date(record.date_created).toLocaleDateString('es-ES', dateSettings)}`}
                    />
                    <FunctionField 
                        label="Cliente"
                        render={record => `${record.billing.first_name} ${record.billing.last_name}`} />
                    <FunctionField 
                        label="Productos"
                        render={record => `${record.line_items.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)} item`}
                    />
                    <FunctionField 
                        label="Total" 
                        sx={{ fontWeight: 'bold' }} 
                        render={record => `${record.total} ${record.currency_symbol}`} 
                        textAlign="right"
                    />
                </Datagrid>
            )}
        </Fragment>
    )
};

export default OrderList;