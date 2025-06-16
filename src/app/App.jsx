import Header from '@/сomponents/Header/Header.jsx';
import TicketFilter from '@/сomponents/TicketFilter/TicketFilter.jsx';
import TicketList from '@/сomponents/TicketList/TicketList.jsx';
import TransfersFilter from '@/сomponents/TransferFilter/TransfersFilter.jsx';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <TransfersFilter />
        </div>
        <div className={styles.main}>
          <TicketFilter />
          <TicketList />
        </div>
      </div>
    </div>
  );
}
