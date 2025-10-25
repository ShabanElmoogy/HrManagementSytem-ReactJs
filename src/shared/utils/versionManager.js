const APP_VERSION = '1.0.0';

export const checkForUpdates = () => {
  const storedVersion = localStorage.getItem('appVersion');
  
  if (storedVersion !== APP_VERSION) {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    localStorage.setItem('appVersion', APP_VERSION);
    return true;
  }
  return false;
};

export const forceReload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  window.location.reload(true);
};

export { APP_VERSION };