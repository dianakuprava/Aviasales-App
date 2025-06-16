import PropTypes from 'prop-types';
import styles from './Ticket.module.scss';

export default function Ticket({ price, carrier, segments }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatTime = (dateString, duration) => {
    const date = new Date(dateString);
    const endDate = new Date(date.getTime() + duration * 60000);

    const format = (d) =>
      d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });

    return `${format(date)} - ${format(endDate)}`;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  return (
    <div className={styles.ticket}>
      <div className={styles.priceLine}>
        <div className={styles.price}>{formatPrice(price)} Р</div>
        <div className={styles.carrierLogo}>
          <img src={`//pics.avs.io/99/36/${carrier}.png`} alt={`${carrier} logo`} />
        </div>
      </div>

      {segments.map((segment, index) => (
        <div className={styles.infoLine} key={index}>
          <div className={styles.infoBlock}>
            <span className={styles.cities}>
              {segment.origin} - {segment.destination}
            </span>
            <span className={styles.time}>{formatTime(segment.date, segment.duration)}</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.way}>В пути</span>
            <span className={styles.time}>{formatDuration(segment.duration)}</span>
          </div>
          <div className={styles.infoBlock}>
            <span className={styles.transfer}>
              {segment.stops.length === 0
                ? 'Без пересадок'
                : `${segment.stops.length} ${segment.stops.length === 1 ? 'пересадка' : 'пересадки'}`}
            </span>
            <span className={styles.airports}>{segment.stops.join(', ')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

Ticket.propTypes = {
  price: PropTypes.number.isRequired,
  carrier: PropTypes.string.isRequired,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      origin: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      stops: PropTypes.arrayOf(PropTypes.string).isRequired,
      duration: PropTypes.number.isRequired,
    })
  ).isRequired,
};
