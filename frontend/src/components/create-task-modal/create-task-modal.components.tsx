import { useState, type FormEvent } from 'react';
import { Modal } from '../modal/modal.component';
import { Button } from '../button/button.component';
import { useTasksContext } from '../../providers/tasks/tasks.context';
import './create-task-modal.style.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { createTask } = useTasksContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="create-task-form">
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Title <span className="required">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            maxLength={200}
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description" className="form-label">
            Description
          </label>
          <textarea
            id="task-description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <Button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            style={{ backgroundColor: '#666' }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}