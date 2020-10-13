/* eslint-disable jsx-a11y/click-events-have-key-events */
import { remote } from 'electron';
import React, { useState } from 'react';
import styles from './Settings.css';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);

  const handleContainerTrigger = () => {
    setIsOpen(!isOpen);
  };

  const handleAlwaysOnTopToggle = () => {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop());
  };

  if (!isOpen) {
    return (
      <button
        className={styles.hamburgerButton}
        type="button"
        onClick={handleContainerTrigger}
      >
        <i className={[styles.hamburgerClosed, 'fas fa-bars'].join(' ')} />
      </button>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.hamburgerButton}
        type="button"
        onClick={handleContainerTrigger}
      >
        <i className={[styles.hamburgerOpened, 'fas fa-bars'].join(' ')} />
      </button>
      <div className={styles.containerContents}>
        <div style={{ fontWeight: 'bold' }}>Settings</div>
        <input
          type="checkbox"
          defaultChecked
          onClick={handleAlwaysOnTopToggle}
        />
        Window always on top
      </div>
    </div>
  );
}
