import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFilter } from '@/store/slices/filtersSlice';
import { Checkbox } from 'antd';
import styles from './TransfersFilter.module.scss';

export default function TransfersFilter() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  return (
    <div className={styles.transfersFilter}>
      <h3 className={styles.title}>КОЛИЧЕСТВО ПЕРЕСАДОК</h3>

      <label className={styles.transferOption}>
        <Checkbox checked={filters.all} onChange={() => dispatch(toggleFilter('all'))}>
          Все
        </Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox
          checked={filters.noTransfers}
          onChange={() => dispatch(toggleFilter('noTransfers'))}
        >
          Без пересадок
        </Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox
          checked={filters.oneTransfer}
          onChange={() => dispatch(toggleFilter('oneTransfer'))}
        >
          1 пересадка
        </Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox
          checked={filters.twoTransfers}
          onChange={() => dispatch(toggleFilter('twoTransfers'))}
        >
          2 пересадки
        </Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox
          checked={filters.threeTransfers}
          onChange={() => dispatch(toggleFilter('threeTransfers'))}
        >
          3 пересадки
        </Checkbox>
      </label>
    </div>
  );
}
