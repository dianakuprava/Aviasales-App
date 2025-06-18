import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTickets, showMoreTickets, resetError } from '@/store/slices/ticketsSlice';
import { selectFilters } from '@/store/slices/filtersSlice';
import { selectSort } from '@/store/slices/sortSlice';
import Ticket from '../Ticket/Ticket';
import Loader from '@/сomponents/Loader/Loader.jsx';
import styles from './TicketList.module.scss';

export default function TicketList() {
  const dispatch = useAppDispatch();

  const {
    items: tickets,
    loading,
    error,
    displayedCount,
    isAllLoaded,
    chunksLoaded,
    totalChunks,
  } = useAppSelector((state) => state.tickets);

  const filters = useAppSelector(selectFilters);
  const sort = useAppSelector(selectSort);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const targetProgress = totalChunks > 0 ? Math.min(chunksLoaded / totalChunks, 1) : 0;

  const [smoothProgress, setSmoothProgress] = useState(0);
  const animationRef = useRef(null);

  const animateProgress = useCallback(() => {
    setSmoothProgress((current) => {
      const diff = targetProgress - current;
      if (diff <= 0) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        return current;
      }
      const minStep = 0.002;
      const maxStep = 0.015;
      const step = Math.min(Math.max(diff, minStep), maxStep);
      return current + step;
    });
    animationRef.current = requestAnimationFrame(animateProgress);
  }, [targetProgress]);

  useEffect(() => {
    if (targetProgress > smoothProgress) {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animateProgress);
      }
    } else if (targetProgress === 1 && smoothProgress < 1) {
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animateProgress);
      }
    } else if (targetProgress < smoothProgress) {
      setSmoothProgress(targetProgress);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [targetProgress, smoothProgress, animateProgress]);

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
        const durationA = ticketDuration(a);
        const durationB = ticketDuration(b);
        return durationA - durationB;
      });
    }

    if (sort === 'optimal') {
      return [...filtered].sort((a, b) => {
        const score = (t) => {
          const priceWeight = 0.6;
          const durationWeight = 0.3;
          const stopsWeight = 0.1;
          const stops = Math.max(t.segments[0].stops.length, t.segments[1].stops.length);
          const duration = t.segments[0].duration + t.segments[1].duration;
          return t.price * priceWeight + duration * durationWeight + stops * stopsWeight;
        };
        return score(a) - score(b);
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
      {!isAllLoaded || loading ? <Loader progress={smoothProgress} /> : null}

      {error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>{error}</div>
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

      {!error && !noResults && ticketsToShow.length > 0 && (
        <button
          type="button"
          className={styles.buttonMore}
          onClick={() => dispatch(showMoreTickets())}
        >
          Показать еще 5 билетов
        </button>
      )}
    </div>
  );
}

function ticketDuration(ticket) {
  return ticket.segments[0].duration + ticket.segments[1].duration;
}
