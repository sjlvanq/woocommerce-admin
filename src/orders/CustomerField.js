import {useRecordContext} from 'react-admin';
import Typography from '@mui/material/Typography';

export default function CustomerField() {
const customer = useRecordContext();
    return (
        <Typography variant="body2">
            {customer.billing.first_name} {customer.billing.last_name}
            <br />
            {customer.billing.address_1}
            <br />
            {customer.billing.state} / {customer.billing.city}
            <br/>
            E-Mail: {customer.billing.email}
            <br/>
            Teléfono: {customer.billing.phone}
        </Typography>
    )
};