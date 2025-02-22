import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductEdit from './ProductEdit';

export default {
    list: ProductList,
    create: ProductCreate,
    edit: ProductEdit,
    icon: LocalOfferIcon,
    options: { label: 'Productos' }
};