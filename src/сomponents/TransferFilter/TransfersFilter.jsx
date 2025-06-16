import { Checkbox } from 'antd';
import styles from './TransfersFilter.module.scss';

export default function TransfersFilter() {
  return (
    <div className={styles.transfersFilter}>
      <h3 className={styles.title}>КОЛИЧЕСТВО ПЕРЕСАДОК</h3>

      <label className={styles.transferOption}>
        <Checkbox checked={false}>Все</Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox checked={true}>Без пересадок</Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox checked={true}>1 пересадка</Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox checked={true}>2 пересадки</Checkbox>
      </label>

      <label className={styles.transferOption}>
        <Checkbox checked={false}>3 пересадки</Checkbox>
      </label>
    </div>
  );
}