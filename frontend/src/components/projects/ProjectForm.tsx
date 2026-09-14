import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../common/Button';
import type { Project } from '../../types/models';

interface ProjectFormProps {
  initialValues?: Pick<Project, 'name' | 'description'>;
  onSubmit: (values: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProjectForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: ProjectFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ name, description });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="entity-form">
      {error && <div className="auth-error" role="alert">{error}</div>}

      <label htmlFor="project-name">Name</label>
      <input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />

      <label htmlFor="project-description">Description</label>
      <textarea id="project-description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : submitLabel}</Button>
      </div>
    </form>
  );
}