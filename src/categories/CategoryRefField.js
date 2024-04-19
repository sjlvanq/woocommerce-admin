import * as React from 'react';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { useRecordContext } from 'react-admin';

const CategoryRefField = (_: { source: string }) => {
    const record = useRecordContext();
    return record ? (
        <MuiLink
            component={Link}
            to={`/products/categories/${record.id}`}
            underline="none"
        >
            {record.name}
        </MuiLink>
    ) : null;
};

export default CategoryRefField;
