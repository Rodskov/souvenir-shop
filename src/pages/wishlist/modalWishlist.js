import React from 'react';
import styles from './modalWishlist.module.scss';

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>
          &times;
        </span>
        <img className={styles.enlargedImage} src={imageUrl} alt="Enlarged Image" />
      </div>
    </div>
  );
};

export default ImageModal;