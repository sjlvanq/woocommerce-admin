import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useRecordContext } from 'react-admin';

const Img = styled('img')({
    width: 25,
    maxWidth: 25,
    maxHeight: 25,
    verticalAlign: 'middle',
});

const ThumbnailField = (_: { source: string; label?: string }) => {
    const record = useRecordContext();
    if (!record) return null;
    return <Img src={record.images[0].src} alt="" />;
};

export default ThumbnailField;
