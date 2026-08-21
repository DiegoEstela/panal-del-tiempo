import type { ValidationStatus } from '../../types/event';
import type { MemberId } from '../../types/member';
import { MEMBERS } from '../../constants/members';
import { Avatar } from '../atoms/Avatar';
import styles from './MemberAvatarGroup.module.css';

interface MemberAvatarGroupProps {
  validations: Record<MemberId, ValidationStatus>;
  createdBy: MemberId;
}

const STATUS_ICON: Record<ValidationStatus, string> = {
  validated: '✓',
  review: '!',
  pending: '·',
};

export function MemberAvatarGroup({ validations, createdBy }: MemberAvatarGroupProps) {
  return (
    <ul className={styles.group}>
      {MEMBERS.map((member) => {
        const isCreator = member.id === createdBy;
        return (
          <li key={member.id} className={styles.item}>
            <Avatar member={member} size="sm" />
            <span
              className={[styles.statusDot, isCreator ? styles.creator : styles[validations[member.id]]].join(' ')}
            >
              {isCreator ? '★' : STATUS_ICON[validations[member.id]]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
