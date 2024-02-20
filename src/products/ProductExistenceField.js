import * as React from 'react';
import { Switch } from '@mui/material';
import { useRecordContext } from 'react-admin';
const ProductExistenceField = (props) => {
  const {source} = props;
  const record = useRecordContext(props);
  return record ? (
      <Switch checked={record.stock_status === "instock"} color="primary" />
  ) : null;
}
ProductExistenceField.defaultProps = {label: 'Publicado'}

export default ProductExistenceField;