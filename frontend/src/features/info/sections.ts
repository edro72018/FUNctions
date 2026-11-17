export interface InfoSection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly items?: readonly string[];
}

export interface InfoItem {
  readonly term: string;
  readonly description: string;
  /** Identificador interno del estado o modo de entrada, sin mostrarse en pantalla. */
  readonly status?: string;
}
