import { ProjectTask } from "@/types";

export default function TaskCard({ task }: { task: ProjectTask }) {
    return (
        <div className="bg-zinc-950/30 border border-zinc-800/60 rounded-3xl p-6 md:p-8 transition-colors hover:border-zinc-700/80 group">
            <h4 className="font-medium text-zinc-100 group-hover:text-amber-500 transition-colors text-lg mb-3">
                {task.title}
            </h4>
            {task.description && (
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {task.description}
                </p>
            )}
            <div className="mt-6 flex items-center justify-between text-xs text-zinc-600 font-medium">
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
