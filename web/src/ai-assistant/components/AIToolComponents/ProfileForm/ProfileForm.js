import React, { useState } from 'react';
import './ProfileForm.css';

/**
 * ProfileForm component
 * Pure, presentational profile/context form. Knows nothing about the AI
 * assistant, chat drawer, or tool system - callers decide how the values
 * are persisted (e.g. via setContext) and how the form is dismissed.
 *
 * Can be rendered anywhere: a modal opened from a button, a card in the
 * AI drawer, an inline section on a page, etc.
 *
 * @param {Object} initialValues - { experience, interest, useCase }
 * @param {Function} onSave - called with the form values when submitted
 * @param {Function} [onCancel] - if provided, shows a Cancel button
 * @param {Function} [onDone] - called after saving; if omitted, a "Saved"
 *   confirmation is shown instead with its own Done button
 * @param {string} [submitLabel] - text for the submit button
 */
function ProfileForm({
  initialValues = {},
  onSave,
  onCancel,
  onDone,
  submitLabel = 'Save Context',
  cancelLabel = 'Cancel'
}) {
  const [formData, setFormData] = useState({
    experience: initialValues.experience || '',
    interest: initialValues.interest || '',
    useCase: initialValues.useCase || ''
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(formData);

    if (onDone) {
      onDone();
    } else {
      setSaved(true);
    }
  };

  return (
    <div className="profile-form">
      <h3 className="profile-form-title">👤 Update Your Profile</h3>
      <p className="profile-form-subtitle">
        Saved here becomes part of the context sent with every message.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="profile-form-group">
          <label htmlFor="profile-experience">Experience Level</label>
          <input
            id="profile-experience"
            type="text"
            placeholder="e.g., Developer, Designer, Product Manager"
            value={formData.experience}
            onChange={handleChange('experience')}
          />
        </div>

        <div className="profile-form-group">
          <label htmlFor="profile-interest">What interests you most?</label>
          <input
            id="profile-interest"
            type="text"
            placeholder="e.g., Integrations, Architecture"
            value={formData.interest}
            onChange={handleChange('interest')}
          />
        </div>

        <div className="profile-form-group">
          <label htmlFor="profile-usecase">What would you use this for?</label>
          <input
            id="profile-usecase"
            type="text"
            placeholder="e.g., Customer support, Internal tools"
            value={formData.useCase}
            onChange={handleChange('useCase')}
          />
        </div>

        <div className="profile-form-actions">
          {onCancel && (
            <button type="button" className="profile-form-cancel" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button type="submit" className="profile-form-save">
            {submitLabel}
          </button>
        </div>
      </form>

      {saved && (
        <div className="profile-form-saved">
          <span>✅ Context saved.</span>
        </div>
      )}
    </div>
  );
}

export default ProfileForm;
