import { useState, type FocusEvent } from 'react';
import { COPY } from '../../constants/copy';
import { TextField } from '../atoms/TextField';
import { Text } from '../atoms/Text';
import styles from './DateFinder.module.css';

export interface DateOption {
  year: number;
  month: number;
  label: string;
  count: number;
}

interface DateFinderProps {
  options: DateOption[];
  onSelect: (option: DateOption) => void;
}

export function DateFinder({ options, onSelect }: DateFinderProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = query.trim()
    ? options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  function handleSelect(option: DateOption) {
    onSelect(option);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={styles.wrapper} onBlur={handleBlur}>
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={COPY.timeline.searchPlaceholder}
        aria-label={COPY.timeline.searchLabel}
      />
      {open && (
        <ul className={styles.dropdown}>
          {filtered.length === 0 ? (
            <li className={styles.empty}>
              <Text variant="caption" color="secondary">
                {COPY.timeline.searchNoResults}
              </Text>
            </li>
          ) : (
            filtered.map((option) => (
              <li key={`${option.year}-${option.month}`}>
                <button type="button" className={styles.option} onClick={() => handleSelect(option)}>
                  <Text as="span">{option.label}</Text>
                  <span className={styles.count}>{option.count}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
