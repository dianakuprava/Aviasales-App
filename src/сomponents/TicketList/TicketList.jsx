import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTickets, showMoreTickets, resetError } from '@/store/slices/ticketsSlice';
import { selectFilters } from '@/store/slices/filtersSlice';
import { selectSort } from '@/store/slices/sortSlice';
import Ticket from '../Ticket/Ticket';
import Loader from '@/сomponents/Loader/Loader.jsx';
import styles from './TicketList.module.scss';

export default function TicketList() {
  const dispatch = useAppDispatch();

  const ticketsState = useAppSelector((state) => state.tickets);

  const { items: tickets, loading, error, displayedCount, isAllLoaded } = ticketsState;

  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filteredAndSortedTickets = useMemo(() => {
    const filtered = tickets.filter((ticket) => {
      const stops = Math.max(ticket.segments[0].stops.length, ticket.segments[1].stops.length);

      return (
        filters.all ||
        (stops === 0 && filters.noTransfers) ||
        (stops === 1 && filters.oneTransfer) ||
        (stops === 2 && filters.twoTransfers) ||
        (stops === 3 && filters.threeTransfers)
      );
    });

    if (sort === 'cheapest') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }

    if (sort === 'fastest') {
      return [...filtered].sort((a, b) => {
        const durationA = a.segments[0].duration + a.segments[1].duration;
        const durationB = b.segments[0].duration + b.segments[1].duration;
        return durationA - durationB;
      });
    }

    if (sort === 'optimal') {
      return [...filtered].sort((a, b) => {
        const priceWeight = 0.6;
        const durationWeight = 0.3;
        const stopsWeight = 0.1;

        const stopsA = Math.max(a.segments[0].stops.length, a.segments[1].stops.length);
        const stopsB = Math.max(b.segments[0].stops.length, b.segments[1].stops.length);

        const durationA = a.segments[0].duration + a.segments[1].duration;
        const durationB = b.segments[0].duration + b.segments[1].duration;

        const scoreA = a.price * priceWeight + durationA * durationWeight + stopsA * stopsWeight;
        const scoreB = b.price * priceWeight + durationB * durationWeight + stopsB * stopsWeight;

        return scoreA - scoreB;
      });
    }

    return filtered;
  }, [tickets, filters, sort]);

  const ticketsToShow = filteredAndSortedTickets.slice(0, displayedCount);
  const hasTickets = tickets.length > 0;
  const noResults = !loading && !error && filteredAndSortedTickets.length === 0 && hasTickets;

  const handleRetry = () => {
    dispatch(resetError());
    dispatch(fetchTickets());
  };

  return (
    <div className={styles.ticketList}>
      {loading && <Loader />}

      {error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>Извините, произошла ошибка на сервере</div>
          <button type="button" className={styles.retryButton} onClick={handleRetry}>
            Обновить
          </button>
        </div>
      ) : noResults ? (
        <div className={styles.noResults}>Рейсов, подходящих под заданные фильтры, не найдено</div>
      ) : (
        ticketsToShow.map((ticket, index) => (
          <Ticket
            key={`${ticket.price}-${ticket.carrier}-${ticket.segments[0].date}-${index}`}
            price={ticket.price}
            carrier={ticket.carrier}
            segments={ticket.segments}
          />
        ))
      )}

      {!error && !noResults && !isAllLoaded && ticketsToShow.length > 0 && (
        <button
          type="button"
          className={styles.buttonMore}
          onClick={() => dispatch(showMoreTickets())}
          disabled={loading}
        >
          Показать еще 5 билетов
        </button>
      )}
    </div>
  );
}
