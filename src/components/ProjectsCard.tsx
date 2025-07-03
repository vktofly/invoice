/**
 * ProjectsCard component
 * Displays a list of projects and a call to action to add projects.
 * Replace the placeholder with real project data from Supabase.
 */
export default function ProjectsCard() {
  return (
    <div className="rounded-xl border bg-white p-4 sm:p-6 shadow-md">
      <div className="flex items-center gap-1 mb-2">
        <h2 className="text-lg font-semibold">Projects</h2>
      </div>
      <div className="text-blue-600 text-sm cursor-pointer">Add Project(s) to this watchlist</div>
      {/* Placeholder for project list */}
      <div className="mt-4 text-gray-400">No projects yet.</div>
    </div>
  );
} 