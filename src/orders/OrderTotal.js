import { useRecordContext } from 'react-admin';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function OrderTotal() {
  const record = useRecordContext();
  const productQuantity = record.line_items.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const shipping = record.shipping_lines[0].method_title;
  const orderTotal = Number(record.total);
  const productTotal = record.line_items.reduce((previousValue, currentValue) => previousValue + Number(currentValue.subtotal), 0);
  const shippingTotal = record.shipping_lines[0].total;

  const CouponTitle = () => {
    if (Object.keys(record.coupon_lines).length === 0) 
      return 
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>Coupon</Typography>
  }

  const Coupon = () => {
    if (Object.keys(record.coupon_lines).length === 0) 
      return
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>{record.coupon_lines[0].code}</Typography>
  }

  const CouponTotal = () => {
    if (Object.keys(record.coupon_lines).length === 0) 
      return
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }} align='right'>-{record.discount_total}</Typography>
  }

  const FeeTitle = () => {
    if (Object.keys(record.fee_lines).length === 0) 
      return 
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>Fee</Typography>
  }

  const Fee = () => {
    if (Object.keys(record.fee_lines).length === 0) 
      return 
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>{record.fee_lines[0].name}</Typography>
  }

  const FeeTotal = () => {
    if (Object.keys(record.fee_lines).length === 0) 
      return 
      return <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }} align='right'>{record.fee_lines[0].total}</Typography>
  }

  const RefundTitle = () => {
    if (Object.keys(record.refunds).length === 0) 
      return 
      return <Typography variant="body2" sx={{ color: 'error.main', mt: 1.5, mb: 1.5 }}>Refunded</Typography>
  }

  const RefundTotal = () => {
    if (Object.keys(record.refunds).length === 0) 
      return 
      const totalRefund = record.refunds.reduce((previousValue, currentValue) => previousValue + Number(currentValue.total), 0);
      return <Typography variant="body2" sx={{ color: 'error.main', mt: 1.5, mb: 1.5 }} align='right'>{totalRefund}</Typography>
  }

  const NetTotal = () => {
    if (Object.keys(record.refunds).length === 0) 
      return <Typography variant="body2" sx={{fontWeight: 'bold', mt: 1.5}} align='right'>{orderTotal}</Typography>
      const totalRefund = record.refunds.reduce((previousValue, currentValue) => previousValue + Number(currentValue.total), 0);
      const netPayment = totalRefund + orderTotal;
      return <Typography variant="body2" sx={{fontWeight: 'bold', mt: 1.5}} align='right'>{netPayment.toFixed(2)}</Typography>
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 3 }}>
        <Grid container>
          <Grid item xs={4}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>Product Total</Typography>
            <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>Shipping</Typography>
            <FeeTitle />
            <CouponTitle />
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1.5, mb: 1.5 }}>Order Total</Typography>
            <Divider />
            <RefundTitle/>
            <Typography variant="body2" sx={{ mt: 1.5 }}>Net Total</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>{productQuantity} item</Typography>
            <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>{shipping}</Typography>
            <Fee />
            <Coupon />
            <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }}>&nbsp;</Typography>
            <Divider />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body2" sx={{ mb: 1.5 }} align='right'>{productTotal.toLocaleString()}</Typography>
            <Typography variant="body2" sx={{ mt: 1.5, mb: 1.5 }} align='right'>{shippingTotal.toLocaleString()}</Typography>
            <FeeTotal />
            <CouponTotal />
            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1.5, mb: 1.5 }} align='right'>{orderTotal}</Typography>
            <Divider />
            <RefundTotal />
            <NetTotal/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}