import React from 'react';
import ProfileForm from './ProfileForm';
import { useAIAssistant } from '../../../AIAssistantContext';

/**
 * ProfileFormToolCard
 * Adapts the plain ProfileForm to the AI tool/drawer system: reads/writes
 * the shared AI Assistant context. This is the piece registered in
 * toolsConfig - it's the only part of this feature that knows about the
 * AI assistant. ProfileForm itself stays reusable outside that system
 * (e.g. rendered in a page's own dialog).
 */
function ProfileFormToolCard() {
  const { context, setContext } = useAIAssistant();

  return (
    <ProfileForm
      initialValues={context.user || {}}
      onSave={(values) => setContext({ user: values })}
    />
  );
}

export default ProfileFormToolCard;
