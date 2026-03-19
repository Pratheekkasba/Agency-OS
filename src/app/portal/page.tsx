"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ProjectTask } from "@/types";
import TaskCard from "@/components/portal/TaskCard";

export default function PortalDashboard() {
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData: ProjectTask[] = [];
            snapshot.forEach((doc) => {
                tasksData.push({ id: doc.id, ...doc.data() } as ProjectTask);
            });
            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    const doneTasks = tasks.filter((t) => t.status === "done");
    const approvedTasks = tasks.filter((t) => t.status === "approved");
    const nextTasks = tasks.filter((t) => t.status === "next");

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Project Status</h1>
                <p className="text-zinc-400 mt-2">
                    A real-time overview of everything happening in your project.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                {/* What is done */}
                <div className="flex flex-col gap-8 min-h-[500px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase">What is done</h2>
                        <span className="ml-auto text-zinc-600 text-sm font-bold">
                            {doneTasks.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-5">
                        {doneTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                        {doneTasks.length === 0 && (
                            <p className="text-sm text-zinc-600 text-center py-8">No tasks in this stage</p>
                        )}
                    </div>
                </div>

                {/* What is approved */}
                <div className="flex flex-col gap-8 min-h-[500px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase">What is approved</h2>
                        <span className="ml-auto text-zinc-600 text-sm font-bold">
                            {approvedTasks.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-5">
                        {approvedTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                        {approvedTasks.length === 0 && (
                            <p className="text-sm text-zinc-600 text-center py-8">No tasks in this stage</p>
                        )}
                    </div>
                </div>

                {/* What is next */}
                <div className="flex flex-col gap-8 min-h-[500px]">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                        <h2 className="text-sm font-semibold tracking-widest text-zinc-300 uppercase">What is next</h2>
                        <span className="ml-auto text-zinc-600 text-sm font-bold">
                            {nextTasks.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-5">
                        {nextTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                        {nextTasks.length === 0 && (
                            <p className="text-sm text-zinc-600 text-center py-8">No tasks in this stage</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
