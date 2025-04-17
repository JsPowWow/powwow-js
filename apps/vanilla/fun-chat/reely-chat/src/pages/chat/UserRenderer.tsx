import { ExtendedUser } from '../../models/user.model';

interface UserRendererProps {
  user: ExtendedUser;
}

export const UserRenderer = ({ user }: UserRendererProps) => {
  return <div class='user-renderer'>{user.login}</div>;
};
