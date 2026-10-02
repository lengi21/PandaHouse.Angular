export interface AppEnvironment {
  readonly production: boolean;
  readonly apiOrigin: string;
  /** Shared Meno catalog event source. Used only for public QR catalog updates. */
  readonly qrCatalogEventsOrigin: string;
}
