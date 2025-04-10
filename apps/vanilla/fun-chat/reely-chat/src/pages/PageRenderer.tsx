import { Spinner } from '../shared/components/Spinner';
import { usePageLoader } from '../shared/routing/PageLoader';

export const PageRenderer = () => {
  const { Page, isLoading } = usePageLoader();

  return Page ?? <Spinner show={isLoading} />;
};
