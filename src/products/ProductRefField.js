import * as React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useRecordContext } from 'react-admin';

const ProductRefField = (_: { source: string }) => {
    const record = useRecordContext();
    return record ? (
        <MuiLink
            component={Link}
            to={`/products/${record.id}`}
            underline="none"
        >
            {record.name}
        </MuiLink>
    ) : null;
};

export default ProductRefField;
