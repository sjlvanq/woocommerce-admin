import { Box, Chip, useMediaQuery, Theme, Typography, Grid } from '@mui/material';
import { ListBase, SimpleList, TopToolbar, SortButton, CreateButton, Title,
FilterContext, FilterForm, Count, Pagination, List, ReferenceManyCount, Datagrid, 
TextField, BooleanField, NumberField, ShowButton, EditButton, DeleteButton,
WrapperField } from 'react-admin';
//import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

const ListActions = () => (
    <TopToolbar>
        <CreateButton label="Nuevo repartidor" />
    </TopToolbar>
);

export const categoryFilters = [
];

const EmptyRepartidores = () => (
    <Box textAlign="center" m={1}>
        <Typography variant="body">
            <DeliveryDiningIcon sx={{fontSize:"5em"}} /> 
        </Typography>
        <Typography variant="body" paragraph>
            Sin repartidores
        </Typography>
    </Box>
);

const RepartidoresList = () => {
    //const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    return (
    <ListBase>
        <Title defaultTitle="Repartidores" />
        <FilterContext.Provider value={categoryFilters}>
            <ListActions />
        </FilterContext.Provider>
        <Datagrid empty={<EmptyRepartidores />}>
            <TextField source="nombre" label="Nombre" />
            <TextField source="telefono" label="Teléfono" />
            <WrapperField>
                <Grid container spacing={2}>
                <Grid item><EditButton label="Editar" /></Grid>
                <Grid item><DeleteButton label="Eliminar" /></Grid>
                </Grid>
            </WrapperField>
        </Datagrid>
    </ListBase>
    );
};

export default RepartidoresList;