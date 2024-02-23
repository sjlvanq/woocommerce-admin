import * as React from 'react';
import { Grid,InputAdornment,useMediaQuery } from '@mui/material';

import {
    Edit,
    NumberInput,
    ReferenceInput,
    SelectInput,
    required,
    TextInput,
    useRecordContext,
    SimpleForm,    
} from 'react-admin';

import Poster from './Poster';

const ProductTitle = () => {
    const record = useRecordContext();
    console.log(record);
    return record ? <span>Productos - {record.name}</span> : null;
};

const ProductCategoriesField = () => {
    //const [] = useState();
    const record = useRecordContext();
    console.log("Valor de record en ProductCategoriesField:");
    console.log(record);
    
    return record ? (
        <ReferenceInput source="category" reference="categories">
            <SelectInput 
                optionText="name" 
                source="categories"
                label="Categoría"
                defaultValue={record.categories[0].id} 
                validate={req} 
                fullWidth 
                resettable={true}
            />
        </ReferenceInput>
    ):null;
};

const ProductEdit = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    return (
    <Edit title={<ProductTitle />}>
    <SimpleForm >
    <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
            <TextInput source="name" label="Nombre del producto" fullWidth validate={req} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <ProductCategoriesField />
        </Grid>
        <Grid item md={4} xs={12}>
                <Poster />
        </Grid>
        <Grid item md={8} xs={12}>
            <Grid container direction="column">
                <Grid item xs={12}>
                        <TextInput source="" disabled={true} fullWidth />
                </Grid>
                <Grid item xs={12}>
                        <TextInput source="" disabled={true} fullWidth />
                </Grid>
                
                <Grid container direction="row" columnSpacing={2}>
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
                        <SelectInput source="stock_status" choices={[
                            { id: 'instock', name: 'Publicado' },
                            { id: 'outofstock', name: 'No publicado' },
                        ]} validate={required()} fullWidth />
                        {/*<ProductInstockField2 />*/}
                        {/*<ProductInstockField />*/}
                    </Grid>
                </Grid>
                
            </Grid>
            {isSmall &&
            <></>
            }
        </Grid>
    </Grid>
    </SimpleForm >
    </Edit>
)
};
const req = [required()];

export default ProductEdit;
