import * as React from 'react';
import { Grid,InputAdornment,useMediaQuery, Button } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
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
import { useNavigate } from 'react-router-dom';


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
        <ReferenceInput source="category" reference="products/categories">
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
    const navigate = useNavigate();
    return (
    <Edit title={<ProductTitle />}>
    <SimpleForm >
    <Grid container columnSpacing={2}>
        <Grid item sm={1}>
            <Button color='primary' onClick={()=>navigate(-1)} variant="contained" startIcon={<WestIcon sx={{mr: -2, ml: -.5}} />} />
        </Grid>
        <Grid item xs={12} sm={7}>
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
                        <TextInput
                            source="regular_price"
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
