import { GroupBox } from '../../shared/components/GroupBox';

export const UsersList = () => {
  return (
    <GroupBox
      caption='Users'
      styles={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '100%', width: '20%' }}
    ></GroupBox>
  );
};
