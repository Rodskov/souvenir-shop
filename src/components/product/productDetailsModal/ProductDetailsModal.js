import React, { useState } from 'react'
import useModal from './useModal';
import styles from "./ProductDetailsModal.module.scss"

const ProductDetailsModal = () => {
    const { isModalOpen, openModal, closeModal } = useModal();

    if (isModalOpen) {
        document.body.classList.add('active-modal');
      } else {
        document.body.classList.remove('active-modal');
    };

    return (
        <>
          <button className='btn-modal' onClick={openModal}>
            Open
          </button>
    
          {isModalOpen && (
            <div className='modal'>
              <div className='overlay' onClick={closeModal}>
                <div className='modal-content'>
                  <h2>Hello Modal</h2>
                  <p>lorem50</p>
                  <button className='close-modal' onClick={closeModal}>CLOSE</button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    };
    
export default ProductDetailsModal;