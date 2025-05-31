import PropTypes from 'prop-types';
import styles from './LoadMoreBtn.module.css';

const LoadMoreBtn = ({ onLoadMore, hasImages }) => {
  if (!hasImages) return null;

  return (
    <div className={styles.buttonContainer}>
      <button
        type="button"
        className={styles.button}
        onClick={onLoadMore}
      >
        Daha Fazla Yükle
      </button>
    </div>
  );
};

LoadMoreBtn.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  hasImages: PropTypes.bool.isRequired,
};

export default LoadMoreBtn;
