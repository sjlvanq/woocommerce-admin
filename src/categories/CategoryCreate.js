import * as React from 'react';
import { Create, SimpleForm, TextInput, required, NumberInput } from 'react-admin';
import { Grid} from '@mui/material';

const CategoryCreate = () => (
    <Create title="Nueva categoría">
        <SimpleForm>

    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="name" label="Nombre de la categoría" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <NumberInput source="menu_order" label="Orden en menú" fullWidth validate={req} />
        </Grid>
    </Grid>

        </SimpleForm>
    </Create>
);
const req = [required()];
export default CategoryCreate;
