import React from 'react';
import styles from './modalWishlist.module.scss';

const VideoModal = ({ videoUrl, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <video src={videoUrl} autoPlay controls />
      </div>
    </div>

  );
};

export default VideoModal;