export default function KanbanSkeleton() {
    return (
        <div className="w-60 h-28 mx-auto border-2 rounded-lg bg-white shadow-md dark:bg-dark-blue-400 dark:border-dark-purple">
            <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
                <div className="flex flex-col space-y-3">
                    <div className="w-32 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-16 h-3 bg-gray-300 rounded-md self-center"></div>
                </div>
            </div>
        </div>
    );
}
