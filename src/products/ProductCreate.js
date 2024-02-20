import * as React from 'react';
import { Create, Form, TextInput, required, NumberInput,ReferenceInput,SelectInput } from 'react-admin';
import { Grid,InputAdornment,Switch,FormControlLabel,ImageListItem,Box,Typography } from '@mui/material';

/*
const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);
*/

const ProductCreate = () => (
    <Create title="Nuevo producto">
        <Form defaultValues={{ sales: 0 }}>

    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="name" label="Nombre del producto" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <ReferenceInput source="category" reference="categories">
                <SelectInput optionText="name" label="Categoría" validate={req} fullWidth />
            </ReferenceInput>
        </Grid>
        <Grid item xs={4} container direction="column" justifyContent="center" alignItems="center">
            {/*<Poster />*/}
                <ImageListItem sx={{textAlign:"center"}} >
                    <Box bgcolor="grey.300" height="200px" width="200px" />
                    <Typography bgcolor="warning.main" color="grey.300">Seleccione una imagen</Typography>
                </ImageListItem>
        </Grid>
        <Grid item xs={8}>
            <Grid item xs={12}>
                    <TextInput source="image" fullWidth validate={req} />
            </Grid>
            <Grid item xs={12}>
                    <TextInput source="thumbnail" fullWidth validate={req} />
            </Grid>
            <Grid container direction="row">
                <Grid item xs={6}>
                    <NumberInput
                        source="price"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">S/.</InputAdornment>
                            ),
                        }}
                        label="Precio"
                        validate={req}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} container direction="column" justifyContent="center" alignItems="center">
                    <FormControlLabel control={<Switch />} label="Disponible" />
                </Grid>
            </Grid>
        </Grid>
    </Grid>


        </Form>
    </Create>
);
const req = [required()];
export default ProductCreate;
