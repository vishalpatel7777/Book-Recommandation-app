import { useState, useCallback } from 'react';
import UI from '../config/constants';

/**
 * Encapsulates the show/hide alert pattern used across 17+ components.
 * Returns state + a flashAlert(message, onDone?) helper.
 */
export function useFlashAlert(duration = UI.ALERT_DURATION) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const flashAlert = useCallback((message, onDone) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      onDone?.();
    }, duration);
  }, [duration]);

  return { showAlert, alertMessage, flashAlert, setShowAlert };
}
