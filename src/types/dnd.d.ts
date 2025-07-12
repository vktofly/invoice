declare module '@hello-pangea/dnd' {
  import { ReactNode } from 'react';
  
  export interface DropResult {
    draggableId: string;
    type: string;
    source: {
      droppableId: string;
      index: number;
    };
    destination?: {
      droppableId: string;
      index: number;
    };
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: any;
    dragHandleProps?: any;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: any;
    placeholder?: ReactNode;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
  }

  export const DragDropContext: React.ComponentType<{
    onDragEnd: (result: DropResult) => void;
    children: ReactNode;
  }>;

  export const Droppable: React.ComponentType<{
    droppableId: string;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => ReactNode;
  }>;

  export const Draggable: React.ComponentType<{
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => ReactNode;
  }>;
} 