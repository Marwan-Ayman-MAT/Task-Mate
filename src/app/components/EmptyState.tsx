import { CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <div className="mb-6 relative w-64 h-64 mx-auto">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1622993361017-180360aea82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMGNoZWNrbGlzdCUyMG1pbmltYWx8ZW58MXx8fHwxNzY0MDc1NTEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Empty task list"
            className="w-full h-full object-cover rounded-2xl opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2 className="w-24 h-24 text-gray-700" strokeWidth={1.5} />
          </div>
        </div>
        
        <h3 className="text-gray-300 mb-2">No tasks yet</h3>
        <p className="text-gray-500 text-sm mb-6">
          Start organizing your day by adding your first task above
        </p>
        
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Use the quick add bar for simple tasks</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Click "Add Task" button for tasks with details</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Drag and drop to reorder in manual mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
