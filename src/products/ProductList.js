import * as React from 'react';
//import { useCallback } from 'react';
import { Box, useMediaQuery, Grid } from '@mui/material';
import {
    FilterButton,
    ListBase,
    Pagination,
    SortButton,
    Title,
    TopToolbar,
    useGetResourceLabel,
    useListContext,
    FilterLiveSearch,
} from 'react-admin';

import ImageList from './GridList';
import ProductFilterCategoriesSel from './ProductFilterCategoriesSel';
import ProductFilterInstockChk from './ProductFilterInstockChk';

const ProductList = () => {

    const getResourceLabel = useGetResourceLabel();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    //const listContext = useListContext();
    //const { sort, setSort, filterValues, setFilters, displayedFilters } = listContext;
    //console.log("listContext");
    //console.log(listContext);
    return (
        <ListBase perPage={12}>
            <Title defaultTitle={getResourceLabel('products', 2)} />
            <Grid container>
                <Grid item md={6} xs={12}>
                <Grid container spacing={2}>                    
                    <Grid item md={6} xs={12}>
                        <ProductFilterCategoriesSel />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <FilterLiveSearch source="search" label="Buscar" />
                    </Grid>
                </Grid>
                    <ProductFilterInstockChk />
                </Grid>
                <Grid item md={6} xs={12}>
                    <ListActions />
                </Grid>
            </Grid>
            {/*</FilterContext.Provider>*/}
            <Box display="flex">
                <Box width={isSmall ? 'auto' : 'calc(100%)'}>
                    <ImageList />
                    <Pagination rowsPerPageOptions={[12, 24, 48, 72]} />
                </Box>
            </Box>
        </ListBase>
    );
};

export const productFilters = [
];

const ListActions = ({ isSmall }) => (
    <TopToolbar>
        {isSmall && <FilterButton />}
        <SortButton fields={['name', 'price', 'sales']} label="Ordenar por" />
            {/*<CreateButton label="Nuevo" />*/}
            {/*<ExportButton label="Exportar" />*/}
    </TopToolbar>
);

export default ProductList;
