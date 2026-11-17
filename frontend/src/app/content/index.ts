type ContentFields = { intro: { text: string }; about: { name: string; purpose: string; team: readonly string[]; authorship: string; license: string } };
export type ContentEntry = { [Id in keyof ContentFields]:
  | { id: Id; approvalStatus: 'pending'; fields: Record<string, never> }
  | { id: Id; approvalStatus: 'approved'; fields: ContentFields[Id] }
}[keyof ContentFields];
export type IntroEntry = Extract<ContentEntry, { id: 'intro' }>;
export type AboutEntry = Extract<ContentEntry, { id: 'about' }>;
export const content: { [Id in keyof ContentFields]: Extract<ContentEntry, { id: Id }> } = {
  intro: { id: 'intro', approvalStatus: 'pending', fields: {} },
  about: { id: 'about', approvalStatus: 'pending', fields: {} },
};
export const pendingContentMessage = 'Contenido pendiente de aprobación.';
