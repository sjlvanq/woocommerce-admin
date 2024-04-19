import * as React from 'react';
import { Create, SimpleForm, TextInput, required, NumberInput } from 'react-admin';
import { Button, Grid } from '@mui/material';
import WestIcon from '@mui/icons-material/West';

const CategoryCreate = () => (
    <Create title="Nueva categoría">
        <SimpleForm>

    <Grid container columnSpacing={2}>
        <Grid item xs={1}>
            <Button color='primary' onClick={()=>{window.location.href = '/cpellal/admmenu/products/categories/'}} variant="contained" startIcon={<         WestIcon sx={{mr: -2, ml: -.5}} />} />
        </Grid>
        <Grid item xs={12} sm={7}>
            <TextInput source="name" label="Nombre de la categoría" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={2}>
            <NumberInput source="menu_order" label="Orden en menú" fullWidth validate={req} />
        </Grid>
    </Grid>

        </SimpleForm>
    </Create>
);
const req = [required()];
export default CategoryCreate;
