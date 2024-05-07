import { useMediaQuery } from '@mui/material';
import { ListBase, SimpleList, TopToolbar, CreateButton, Title,
FilterContext, Datagrid, NumberField, EditButton } from 'react-admin';

import CategoryRefField from './CategoryRefField';

const ListActions = () => (
    <TopToolbar>
        {/*<SortButton fields={['name','count','menu_order']} label="Ordenar por" />*/}
        {/*Parámetro orderby sólo acepta id, include, name, slug, term_group, description and count*/}
        <CreateButton label="Nueva categoría" />   
    </TopToolbar>
);

export const categoryFilters = [
];

const CategoryList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('md'));
    return (
    <ListBase
        sort={{ field: 'name', order: 'asc'}}
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
			secondaryText={record => (
                <>
                    {record.count} productos
                </>
            )}
			tertiaryText={record => (<>Orden: {record.menu_order}</>)}
            linkType={record => "edit"}
            /*rowSx={record => ({ backgroundColor: record.nb_views >= 500 ? '#efe' : 'white' })}*/
        />
        : <Datagrid>
            <CategoryRefField source="name" label="Nombre" />
            <NumberField source="count" label="Productos" />
            <NumberField source="menu_order" label="Posición" sortable={false} />
            <EditButton label="Editar" />
          </Datagrid>
        }
        
        {/*
            */}
    </ListBase>
);
};

export default CategoryList;