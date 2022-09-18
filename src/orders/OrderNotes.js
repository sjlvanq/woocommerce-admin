import { useGetManyReference, useRecordContext, Loading } from 'react-admin';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function OrderNotes () {
  const record = useRecordContext();
  const { data, isLoading, error } = useGetManyReference('orders', { target: 'notes', id: record.id });
  const dateSettings = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  if (isLoading) { return <Loading />; }
  if (error) { return <p>No notes!</p>; }
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Order Notes
        </Typography>
        {data.map((note) => (
          <Box mt={1.8}>
            <Typography variant="body2"><div dangerouslySetInnerHTML={{__html:note.note}} /></Typography>
            <Typography sx={{ fontSize: 12 }} color="text.secondary">{new Date(note.date_created).toLocaleDateString('tr-TR', dateSettings)}</Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};