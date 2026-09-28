// Configuração global do Jest para Angular (zoneless).
// Referenciado em jest.config.ts (setupFilesAfterEach).
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
