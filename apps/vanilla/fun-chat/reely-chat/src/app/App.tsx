import { PageRenderer } from '../pages/PageRenderer';
import { AppWindow } from './AppWindow';
import { PathName, route404, routes } from './routes';
import { RouterContextProvider } from '../shared/routing/useRouter';

export const App = () => {
  return (
    <RouterContextProvider<PathName> routes={routes} fallback={route404}>
      <AppWindow>
        <PageRenderer />
      </AppWindow>
    </RouterContextProvider>
  );
};
