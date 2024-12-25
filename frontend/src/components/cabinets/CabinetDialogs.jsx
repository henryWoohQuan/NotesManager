import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export const CreateCabinetDialog = ({ open, onOpenChange, onConfirm }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Cabinet name is required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onConfirm(trimmedName);
      setName('');
      onOpenChange(false);
    } catch (err) {
      if (err.message.includes('already exists')) {
        setError('A cabinet with this name already exists');
      } else {
        setError(err.message || 'Failed to create cabinet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Cabinet</DialogTitle>
            <DialogDescription>
              Enter a name for your new cabinet.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Cabinet name"
              className={error ? 'border-red-500' : ''}
              autoFocus
              disabled={isSubmitting}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Cabinet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteCabinetDialog = ({ 
  open, 
  onOpenChange, 
  cabinet, 
  onConfirm 
}) => {
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!open) {
      setError('');
      setIsDeleting(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (!cabinet) return;

    setError('');
    setIsDeleting(true);

    try {
      await onConfirm();
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Failed to delete cabinet');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!cabinet) return null;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isDeleting) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Cabinet</DialogTitle>
          <DialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{cabinet.name}</strong>?
            </p>
            <p className="font-medium text-red-500">
              This will permanently delete all notes in this cabinet. 
              This action cannot be undone.
            </p>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Cabinet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};