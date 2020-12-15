/* eslint-disable jsx-a11y/click-events-have-key-events */
import { remote } from 'electron';
import Store from 'electron-store';
import React, { useState } from 'react';
import { version } from '../../../package.json';
import styles from './Settings.css';

export default function Settings() {
  const store = new Store();

  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsUpdated, setIsSettingsUpdated] = useState(false);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [lastShortcut, setLastShortcut] = useState(
    store.get('shortcuts.lastMessage')
  );
  const [nextShortcut, setNextShortcut] = useState(
    store.get('shortcuts.nextMessage')
  );

  const handleContainerTrigger = () => {
    setIsOpen(!isOpen);
  };

  const handleAlwaysOnTopToggle = () => {
    remote
      .getCurrentWindow()
      .setAlwaysOnTop(!remote.getCurrentWindow().isAlwaysOnTop());
  };

  const handleUpdateSettings = () => {
    store.set('shortcuts.lastMessage', lastShortcut);
    store.set('shortcuts.nextMessage', nextShortcut);
    setIsSettingsUpdated(false);
    setIsUpdateRequired(true);
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
        <div>
          <input
            type="checkbox"
            defaultChecked
            onClick={handleAlwaysOnTopToggle}
          />
          Window always on top
        </div>
        {/*
        TODO: Save state on value change. Add "Update" button to save configs
         */}
        <div>
          <input
            type="text"
            defaultValue={lastShortcut}
            onChange={(e) => {
              setLastShortcut(e.target.value);
              setIsSettingsUpdated(true);
            }}
          />
          Last Message Shortcut
        </div>
        <div>
          <input
            type="text"
            defaultValue={nextShortcut}
            onChange={(e) => {
              setNextShortcut(e.target.value);
              setIsSettingsUpdated(true);
            }}
          />
          Next Message Shortcut
        </div>
      </div>
      {isSettingsUpdated && (
        <div>
          <a onClick={handleUpdateSettings}>Save Settings</a>
        </div>
      )}
      {isUpdateRequired && (
        <div>Restart the app for your shortcuts to work!</div>
      )}
      <div className={styles.version}>{`v${version}`}</div>
    </div>
  );
}
