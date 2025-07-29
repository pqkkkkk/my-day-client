import { List } from "@/types";
import { colorUtils } from "@/utils/color-utils";

interface ListCardProps {
    list: List;
    onEdit?: (list: List) => void;
    onDelete?: (listId: string) => void;
    setSelectedList: (list: List) => void;
}

export const ListCard = ({ list, onEdit, onDelete, setSelectedList }: ListCardProps) => {
    return (
        <div
        key={list.listId}
        onClick={() => setSelectedList(list)}
        className={`
            cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-lg
            ${colorUtils.getColorClassByHex(list.color || '#f0f0f0')}
        `}
        >
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{list.listTitle}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{list.listDescription}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${colorUtils.getColorClassByHex(list.color || '#f0f0f0')}`}></div>
            {/* Actions */}
            <div className="flex space-x-1 ml-2">            
                <button
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Edit task">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                
                <button
                    onClick={() => onDelete?.(list.listId)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete task">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
            <span>Progress</span>
            <span>{list.completedTasksCount}/{list.totalTasksCount} tasks</span>
            </div>

            <div className="w-full bg-white/30 rounded-full h-2">
            <div 
                className="bg-white/60 h-2 rounded-full transition-all duration-300"
                style={{ width: `${list.progressPercentage}%` }}
            ></div>
            </div>

            <div className="flex justify-between items-center text-sm">
            <span>{Math.round(list.progressPercentage || 0)}% complete</span>
            <span className="opacity-70">
                Updated {new Date(list.updatedAt).toLocaleDateString()}
            </span>
            </div>
        </div>
    </div>
    );
}