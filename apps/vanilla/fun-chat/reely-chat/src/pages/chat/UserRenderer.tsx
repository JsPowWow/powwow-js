import { RemoteUser } from '../../models/user';

interface UserRendererProps {
  user: RemoteUser;
}

export const UserRenderer = ({ user }: UserRendererProps) => {
  return <div class='user-renderer'>{user.login}</div>;
};
