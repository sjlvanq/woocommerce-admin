import * as React from 'react';
import { useTheme, useMediaQuery, Typography } from '@mui/material';
import { Box, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useCreatePath, NumberField, useListContext } from 'react-admin';
import { Link } from 'react-router-dom';
import ProductExistenceField from './ProductExistenceField';

const GridList = () => {
    const { isLoading } = useListContext();
    return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};

const useColsForWidth = () => {
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.up('sm'));
    const md = useMediaQuery(theme.breakpoints.up('md'));
    const lg = useMediaQuery(theme.breakpoints.up('lg'));
    const xl = useMediaQuery(theme.breakpoints.up('xl'));
    // there are all dividers of 24, to have full rows on each page
    if (xl) {console.log('xl 8'); return 8;}
    if (lg) {console.log('lg 6'); return 6;}
    if (md) {console.log('md 4'); return 4;}
    if (sm) {console.log('sm 3'); return 3;}
    console.log('ninguno'); return 2;
};

const times = (nbChildren: number, fn: (key: number) => any) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = () => {
    const { perPage } = useListContext();
    const cols = useColsForWidth();
    return (
        <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
            {times(perPage, key => (
                <ImageListItem key={key}>
                    <Box bgcolor="grey.300" height="100%" />
                </ImageListItem>
            ))}
        </ImageList>
    );
};

const LoadedGridList = () => {
    const { data } = useListContext();
    const cols = useColsForWidth();
    const createPath = useCreatePath();

    if (!data) return null;

    return (
        <ImageList rowHeight={180} cols={cols} sx={{ m: 0 }}>
            {data.map(record => (
                <ImageListItem
                    component={Link}
                    key={record.id}
                    to={createPath({
                        resource: 'products',
                        id: record.id,
                        type: 'edit',
                    })}
                >
                    {record.images[0] &&
                    <img src={record.images[0].src} alt="" />
                    }
                    <ImageListItemBar
                        title={
                            <Typography
                              component="div"
                              variant="subtitle1"
                              style={{ whiteSpace: 'normal' }}
                            >
                                {record.name}
                            </Typography>
                        }
                        subtitle={
                            <span>
                                <NumberField
                                    source="regular_price"
                                    record={record}
                                    color="inherit"
                                    options={{
                                        style: 'currency',
                                        currency: 'PEI',
                                    }}
                                    sx={{
                                        display: 'inline',
                                        fontSize: '1em',
                                    }}
                                />
                            </span>
                        }
                        sx={{
                            background: record.stock_status === "instock" ?
                                'linear-gradient(to top, rgba(0,0,100,0.5) 0%,rgba(33,150,243,0.7) 30%,rgba(33,150,243,0) 100%)' : 
                                'linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)'
                        }}
                    />
                    
                </ImageListItem>
            ))}
        </ImageList>
    );
};

export default GridList;
