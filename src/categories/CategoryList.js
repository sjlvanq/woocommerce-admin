import { Box, Chip, useMediaQuery, Theme, Typography } from '@mui/material';
import { ListBase, SimpleList, TopToolbar, SortButton, CreateButton, Title,
FilterContext, FilterForm, Count, Pagination, List, ReferenceManyCount, Datagrid, TextField, BooleanField, NumberField, ShowButton, EditButton } from 'react-admin';

import CategoryRefField from './CategoryRefField';

const ListActions = () => (
    <TopToolbar>
        <SortButton fields={['name','count','menu_order']} label="Ordenar por" />
        <CreateButton label="Nueva categoría" />   
    </TopToolbar>
);

export const categoryFilters = [
];

const CategoryList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    return (
    <ListBase
        sort={{ field: 'menu_order', order: 'asc'}}
    >
        <Title defaultTitle="Categorías" />
        <FilterContext.Provider value={categoryFilters}>
            <ListActions />
            {/*
            isSmall && (
                <Box m={1}>
                    <FilterForm />
                </Box>
            )
            */}
        </FilterContext.Provider>
        {isSmall
        ? <SimpleList
            sort={{ field: 'menu_order', order: 'asc'}}
            primaryText={record => record.name}
			secondaryText={record =>
                <Typography component="span">
                    {record.count} productos
                </Typography>
            }
			tertiaryText={record => <Typography component="span">Orden: {record.menu_order}</Typography>}
            linkType={record => "edit"}
            /*rowSx={record => ({ backgroundColor: record.nb_views >= 500 ? '#efe' : 'white' })}*/
        />
        : <Datagrid basePath="/products/categories">
            <CategoryRefField source="name" label="Nombre" />
            <NumberField source="count" label="Productos" />
            <NumberField source="menu_order" label="Posición" />
            <EditButton basePath="/categories" label="Editar" />
          </Datagrid>
        }
        
        {/*
            */}
    </ListBase>
);
};

export default CategoryList;