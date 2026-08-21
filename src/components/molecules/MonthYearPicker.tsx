import { MONTH_NAMES, EARLIEST_YEAR, CURRENT_YEAR } from '../../constants/config';
import { Select } from '../atoms/Select';
import styles from './MonthYearPicker.module.css';

interface MonthYearPickerProps {
  month: number;
  year: number;
  onChangeMonth: (month: number) => void;
  onChangeYear: (year: number) => void;
}

const YEARS = Array.from({ length: CURRENT_YEAR - EARLIEST_YEAR + 1 }, (_, index) => CURRENT_YEAR - index);

export function MonthYearPicker({ month, year, onChangeMonth, onChangeYear }: MonthYearPickerProps) {
  return (
    <div className={styles.row}>
      <Select value={month} onChange={(event) => onChangeMonth(Number(event.target.value))}>
        {MONTH_NAMES.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </Select>
      <Select value={year} onChange={(event) => onChangeYear(Number(event.target.value))}>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
    </div>
  );
}
