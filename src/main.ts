import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const chunkRecoveryKey = 'panda-house:chunk-recovery';

const recoverFromStaleChunk = (reason: unknown): void => {
  const message = reason instanceof Error ? reason.message : String(reason ?? '');
  if (!/failed to fetch dynamically imported module|importing a module script failed/i.test(message)) return;
  if (sessionStorage.getItem(chunkRecoveryKey)) return;
  sessionStorage.setItem(chunkRecoveryKey, '1');
  window.location.reload();
};

window.addEventListener('error', (event) => recoverFromStaleChunk(event.error ?? event.message));
window.addEventListener('unhandledrejection', (event) => recoverFromStaleChunk(event.reason));

bootstrapApplication(App, appConfig)
  .then(() => sessionStorage.removeItem(chunkRecoveryKey))
  .catch((err) => {
    recoverFromStaleChunk(err);
    console.error(err);
  });
