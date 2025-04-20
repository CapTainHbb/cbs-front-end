import {Permission, User, UserProfile} from 'pages/ManageUsers/types';

export function defineAbilitiesFor(user: User): any {
  return [
    ...(user.is_superuser
        ? [{action: 'manage', subject: 'all'}]
        : []),
    ...user.user_permissions.map((perm: Permission) => ({
      action: perm.codename.split('_')[0],
      subject: perm.codename.split('_').slice(1).join('_'),
      conditions: {subject: perm.app_label},
    })),
    {action: "view", subject: "home"}
  ];
}

export function hasUserThisPermission(userProfile: UserProfile, codename: string): boolean {
  if(userProfile.user.is_superuser){
    return true;
  }

  for(let i = 0; i < userProfile?.user?.user_permissions.length; i++) {
      const perm = userProfile?.user?.user_permissions[i];
      if(perm?.codename === codename) {
        return true;
      }
    }
    return false;
}