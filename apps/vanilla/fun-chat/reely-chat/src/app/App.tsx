import { useGetCurrentPage } from './routes';
import { Spinner } from '../components/Spinner';

export const App = () => {
  const { Page, isLoading } = useGetCurrentPage();

  return Page ?? <Spinner show={isLoading} />;
};
