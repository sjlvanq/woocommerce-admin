import * as React from 'react';
import { Button, Grid } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import WestIcon from '@mui/icons-material/West';

import {
    Datagrid,
    Edit,
    EditButton,
    NumberField,
    Labeled,
    ReferenceManyField,
    SimpleForm,
    TextInput,
    useRecordContext,
    BooleanField
} from 'react-admin';
//import { useMediaQuery, Typography } from '@mui/material'

import ThumbnailField from '../products/ThumbnailField';
import ProductRefField from '../products/ProductRefField';
//import ProductExistenceField from '../products/ProductExistenceField';

const ProductInstockField = (props) => {
    const {source} = props;
    const record = useRecordContext(props);
    if(!record){return null;}
    return record.stock_status === 'instock' ? <DoneIcon />
    : <CloseIcon />
};
ProductInstockField.defaultProps = {label: 'Publicado'}

const CategoryEdit = () => {
    //const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    return (
    <Edit title={<CategoryTitle />}>
        <SimpleForm>
            <Grid container columnSpacing={2}>
            <Grid item>
            <Button color='primary' href="../categories" variant="contained" startIcon={<         WestIcon sx={{mr: -2, ml: -.5}} />} />
            </Grid>
            <Grid item>
            <TextInput source="name" />
            </Grid>
            </Grid>
            
            <Labeled label="Productos" fullWidth>
                <ReferenceManyField
                    reference="products"
                    target="categories"
                    sort={{field: 'name', order: 'ASC'}}
                >
                {/*
                {isSmall
                    ? <SimpleList
                        sort={{ field: 'menu_order', order: 'asc'}}
                        primaryText={record => <> <ThumbnailField source="thumbnail" label="" /> {record.name} </>}
                        secondaryText={
                            <NumberField
                                source="price"
                                options={{ style: 'currency', currency: 'PEI' }}
                            />}
                        tertiaryText={record => 
                            <BooleanField
                                source={(record.stock_status == "instock")}
                            />
                        }
                        linkType={record => "edit"}
                    />
                    :
                */} 
                    <Datagrid
                        sx={{
                            '& .column-thumbnail': {
                                width: 25,
                                padding: 0,
                            },
                        }}
                    >
                        <ThumbnailField source="thumbnail" label="" />
                        <ProductRefField source="name" label="Producto" />
                        <ProductInstockField source="stock_status" />
                        {/*
                        <ProductExistenceField source="stock_status" />
                        */}
                        <NumberField
                            source="price"
                            options={{ style: 'currency', currency: 'PEI' }}
                        />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </Labeled>
        </SimpleForm>
    </Edit>
)};

const CategoryTitle = () => {
    const record = useRecordContext();
    return record ? (
        <span>
            {record.name}
        </span>
    ) : null;
};

export default CategoryEdit;
