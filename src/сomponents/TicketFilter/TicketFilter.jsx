import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSort } from '@/store/slices/sortSlice';
import { selectSort } from '@/store/slices/sortSlice';
import styles from './TicketFilter.module.scss';

export default function TicketFilter() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector(selectSort);

  return (
    <div className={styles.buttonWrapper}>
      <button
        className={`${styles.button} ${currentSort === 'cheapest' ? styles.active : ''}`}
        onClick={() => dispatch(setSort('cheapest'))}
        type="button"
      >
        Самый дешевый
      </button>
      <button
        className={`${styles.button} ${currentSort === 'fastest' ? styles.active : ''}`}
        onClick={() => dispatch(setSort('fastest'))}
        type="button"
      >
        Самый быстрый
      </button>
      <button
        className={`${styles.button} ${currentSort === 'optimal' ? styles.active : ''}`}
        onClick={() => dispatch(setSort('optimal'))}
        type="button"
      >
        Оптимальный
      </button>
    </div>
  );
}
