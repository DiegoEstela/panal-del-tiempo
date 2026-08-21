import type { EventComment } from '../../types/event';
import { getMember } from '../../constants/members';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import styles from './CommentThread.module.css';

interface CommentThreadProps {
  comments: EventComment[];
}

export function CommentThread({ comments }: CommentThreadProps) {
  return (
    <ul className={styles.thread}>
      {comments.map((comment) => {
        const author = getMember(comment.author);
        return (
          <li key={comment.id} className={styles.comment}>
            <Avatar member={author} size="sm" />
            <div>
              <Text variant="caption" color="secondary">
                {author.name}
              </Text>
              <Text>{comment.text}</Text>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
