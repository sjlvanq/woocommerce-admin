import * as React from 'react';
import { Create, SimpleForm, TextInput, required, NumberInput } from 'react-admin';
import { Grid, Button} from '@mui/material';
import WestIcon from '@mui/icons-material/West';

const RepartidoresCreate = () => {
  return (
    <Create title="Nuevo repartidor">
    <SimpleForm >
        <Grid container columnSpacing={2}>
                <Grid item sm={1}>
                    <Button color='primary' onClick={()=>{window.location.href = '/cpellal/admmenu/repartidores/'}} variant="contained" startIcon={<WestIcon sx={{mr: -2, ml: -.5}} />} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextInput source="nombre" label="Nombre del repartidor" fullWidth validate={req} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextInput source="telefono" label="Teléfono (sólo números)" fullWidth />
                </Grid>
        </Grid>
    </SimpleForm >
    </Create>
)};
const req = [required()];
export default RepartidoresCreate;
