"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { APPLICATION_STATUSES, type ApplicationStatus, type JobApplication } from "@/lib/types";

function daysAgo(date: string): string {
  const days = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000)));
  return days === 0 ? "Today" : `${days}d ago`;
}

function KanbanCard({ app }: { app: JobApplication }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app._id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={
        transform ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10 } : undefined
      }
      className={`cursor-grab space-y-1.5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <p className="truncate text-sm font-medium text-gray-900">{app.companyName}</p>
      <p className="truncate text-xs text-gray-500">{app.jobTitle}</p>
      <div className="flex items-center justify-between pt-1">
        {app.proposedSalary ? (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
            {app.salaryCurrency} {app.proposedSalary.toLocaleString()}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[11px] text-gray-400">{daysAgo(app.dateApplied)}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ status, apps }: { status: ApplicationStatus; apps: JobApplication[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-xl border p-2 ${
        isOver ? "border-indigo-300 bg-indigo-50/40" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-xs font-semibold text-gray-700">{status}</span>
        <span className="text-xs text-gray-400">{apps.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-1 py-1" style={{ minHeight: 40 }}>
        {apps.map((app) => (
          <KanbanCard key={app._id} app={app} />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  applications,
  onStatusChange,
}: {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as ApplicationStatus;
    const app = applications.find((a) => a._id === active.id);
    if (app && app.status !== newStatus) {
      onStatusChange(String(active.id), newStatus);
    }
  }

  const activeApp = applications.find((a) => a._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {APPLICATION_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            apps={applications.filter((a) => a.status === status)}
          />
        ))}
      </div>
      <DragOverlay>{activeApp && <KanbanCard app={activeApp} />}</DragOverlay>
    </DndContext>
  );
}
