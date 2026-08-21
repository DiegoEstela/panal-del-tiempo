import type { Member } from '../../types/member';
import styles from './Avatar.module.css';

interface AvatarProps {
  member: Member;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ member, size = 'md' }: AvatarProps) {
  return (
    <div className={[styles.avatar, styles[size]].join(' ')} style={{ backgroundColor: member.colorAccent }} title={member.name}>
      {member.photoURL ? (
        <img src={member.photoURL} alt={member.name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{member.initials}</span>
      )}
    </div>
  );
}
