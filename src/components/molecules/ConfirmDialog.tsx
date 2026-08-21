import { Modal } from './Modal';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal onClose={onCancel} labelledBy="confirm-dialog-title">
      <div className={styles.content}>
        <Text as="h2" id="confirm-dialog-title" variant="heading">
          {title}
        </Text>
        <Text color="secondary">{message}</Text>
        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
