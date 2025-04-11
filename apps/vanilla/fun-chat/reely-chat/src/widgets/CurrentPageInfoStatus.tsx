import { useRouter } from '../shared/routing/useRouter';

export const CurrentPageInfoStatus = () => {
  const { pathName } = useRouter();
  return `Site: ${pathName}`;
};
