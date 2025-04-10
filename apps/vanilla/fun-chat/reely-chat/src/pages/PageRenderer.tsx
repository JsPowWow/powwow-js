import { Spinner } from '../shared/components/Spinner';
import { useLoadPage } from '../shared/routing/PageLoader';

export const PageRenderer = () => {
  const { Page, isLoading } = useLoadPage();

  return Page ?? <Spinner show={isLoading} />;
};
