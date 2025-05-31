import PropTypes from 'prop-types';
import { ThreeDots } from 'react-loader-spinner';
import styles from './Loader.module.css';

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loader}>
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#3f51b5"
        ariaLabel="loading"
      />
    </div>
  );
};

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default Loader;
