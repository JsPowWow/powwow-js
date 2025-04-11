import { useRouter } from '../shared/routing/Router';

export const CurrentPageInfoStatus = () => {
  const { pathName } = useRouter();
  return `Site: ${pathName}`;
};
