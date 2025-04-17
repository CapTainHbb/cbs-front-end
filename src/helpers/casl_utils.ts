import { createMongoAbility, MongoAbility, RawRuleOf } from '@casl/ability';
import { Permission, User } from 'pages/ManageUsers/types';

export type AppAbility = MongoAbility<
  [string, string],
  { app_label?: string }
>;

export function defineAbilitiesFor(user: User): any {
  const rules: RawRuleOf<AppAbility>[] = [
    ...(user.is_superuser
      ? [{ action: 'manage', subject: 'all' }]
      : []),
    ...user.user_permissions.map((perm: Permission) => ({
      action: perm.codename.split('_')[0],
      subject: perm.codename.split('_').slice(1).join('_'),
      conditions: { app_label: perm.app_label },
    })),
    {action: "view", subject: "home"}
  ];

  return rules;
}