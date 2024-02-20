import * as React from 'react';
//import { useState } from 'react';
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

//import CustomerReferenceField from '../visitors/CustomerReferenceField';
//import StarRatingField from '../reviews/StarRatingField';
import Poster from './Poster';
//import CreateRelatedReviewButton from './CreateRelatedReviewButton';

const ProductTitle = () => {
    const record = useRecordContext();
    console.log(record);
    return record ? <span>Productos - {record.name}</span> : null;
};

/*
const ProductInstockField = () => {
    const record = useRecordContext();
    return record ?  <FormControlLabel 
            control={<Switch checked={record.stock_status==="instock"} />} 
            label="Publicado" /> : null;
};

const ProductInstockField2 = () => {
    const record = useRecordContext();
    const [instock, setInstock] = useState(record.stock_status==='instock');
    return record ? <BooleanInput 
        label="Publicado" 
        source="stock_status"
        format={(v) => (v==='instock')}
        parse={(v) => {return v.checked?'instock':'outofstock'; }}
        //initialValue={(v) => v.checked?'instock':'outofstock'}
        initialValue={record.stock_status}
        checked={instock}
        onChange={
            (e)=>{
                console.log(e);
                console.log(record);
                setInstock(!instock);
            }
        }
    />:null;
};
*/

const ProductCategoriesField = () => {
    const record = useRecordContext();
    return record ? (
        <ReferenceInput source="category" reference="categories">
            <SelectInput 
                optionText="name" 
                label="Categoría" 
                defaultValue={record.categories[0].id} 
                validate={req} 
                fullWidth 
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
