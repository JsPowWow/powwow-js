import { PageRenderer } from '../pages/PageRenderer';
import { AppWindow } from './AppWindow';
import { PathName, route404, routes } from './routes';
import { RouterContextProvider } from '../shared/routing/useRouter';
import { useReconnectOnError } from '../scene/audience/useReconnectOnError';

export const App = () => {
  // TODO AR get interval from settings
  useReconnectOnError(7000);

  return (
    <RouterContextProvider<PathName> routes={routes} fallback={route404}>
      <AppWindow>
        <PageRenderer />
      </AppWindow>
    </RouterContextProvider>
  );
};
