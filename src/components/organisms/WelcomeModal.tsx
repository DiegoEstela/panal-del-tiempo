import { useState } from 'react';
import type { MemberId } from '../../types/member';
import { MEMBERS } from '../../constants/members';
import { COPY } from '../../constants/copy';
import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Modal } from '../molecules/Modal';
import styles from './WelcomeModal.module.css';

interface WelcomeModalProps {
  onSelect: (id: MemberId) => void;
}

export function WelcomeModal({ onSelect }: WelcomeModalProps) {
  const [selected, setSelected] = useState<MemberId | null>(null);

  return (
    <Modal labelledBy="welcome-title">
      <div className={styles.content}>
        <Text as="h1" id="welcome-title" variant="title">
          {COPY.welcome.title}
        </Text>
        <Text color="secondary">{COPY.welcome.subtitle}</Text>
        <div className={styles.options}>
          {MEMBERS.map((member) => (
            <button
              key={member.id}
              type="button"
              className={[styles.option, selected === member.id ? styles.selected : ''].join(' ')}
              onClick={() => setSelected(member.id)}
            >
              <Avatar member={member} size="lg" />
              <Text variant="subheading">{member.name}</Text>
            </button>
          ))}
        </div>
        <Button fullWidth disabled={!selected} onClick={() => selected && onSelect(selected)}>
          {COPY.welcome.confirm}
        </Button>
      </div>
    </Modal>
  );
}
