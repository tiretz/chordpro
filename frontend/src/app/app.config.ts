import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

import { apiInterceptor } from './core/interceptors/api.interceptor';

import { routes } from './app.routes';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'monaco',
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideHttpClient(withInterceptors([apiInterceptor])), importProvidersFrom(MonacoEditorModule.forRoot(monacoConfig))],
};
