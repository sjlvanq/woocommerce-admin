import * as React from 'react';
import { Grid,InputAdornment,useMediaQuery, Button } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import {
    Edit,
    required,
    TextInput,
    useRecordContext,
    SimpleForm,    
} from 'react-admin';

const RepartidoresTitle = () => {
    const record = useRecordContext();
    return record ? <span>Productos - {record.name}</span> : null;
};

const RepartidoresEdit = () => {
    return (
    <Edit title={<RepartidoresTitle />}>
    <SimpleForm >
    <Grid container columnSpacing={2}>
        <Grid item sm={1}>
            <Button color='primary' onClick={()=>{window.location.href = '/cpellal/admmenu/repartidores/'}} variant="contained" startIcon={<WestIcon sx={{mr: -2, ml: -.5}} />} />
        </Grid>
        <Grid item xs={12} sm={7}>
            <TextInput source="nombre" label="Nombre del repartidor" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <TextInput source="telefono" label="Teléfono" fullWidth />
        </Grid>
    </Grid>
    </SimpleForm >
    </Edit>
)
};
const req = [required()];

export default RepartidoresEdit;
