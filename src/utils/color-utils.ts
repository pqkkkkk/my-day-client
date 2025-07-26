
export const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500", colorHex: "#3B82F6" },
    { value: "green", label: "Green", class: "bg-green-500", colorHex: "#10B981",},
    { value: "purple", label: "Purple", class: "bg-purple-500", colorHex: "#8B5CF6",},
    { value: "red", label: "Red", class: "bg-red-500", colorHex: "#EF4444" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500", colorHex: "#F59E0B",},
    { value: "indigo", label: "Indigo", class: "bg-indigo-500", colorHex: "#6366F1",},
    { value: "pink", label: "Pink", class: "bg-pink-500", colorHex: "#EC4899" },
    { value: "teal", label: "Teal", class: "bg-teal-500", colorHex: "#14B8A6" },
    { value: "gray", label: "Gray", class: "bg-gray-500", colorHex: "#6B7280" }
];

const colorClass: Record<string, string> = {
    'blue': "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300",
    'green': "bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300",
    'purple': "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300",
    'red': "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-300",
    'yellow': "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300",
    'indigo': "bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-300",
    'pink': "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900 dark:border-pink-700 dark:text-pink-300",
    'teal': "bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900 dark:border-teal-700 dark:text-teal-300",
    'gray': "bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
};

export const colorUtils = {
    getColorClass: (color: string) => {
        const colorOption = colorOptions.find(option => option.value === color);
        return colorOption ? colorClass[colorOption.value] : colorClass['gray']; // Default to gray if not found
    },
    getColorClassByHex: (colorHex: string) => {
        const colorOption = colorOptions.find(option => option.colorHex === colorHex);
        return colorOption ? colorClass[colorOption.value] : colorClass['gray']; // Default to gray if not found
    },
    getColorHex: (color: string) => {
        const colorOption = colorOptions.find(option => option.value === color);
        return colorOption ? colorOption.colorHex : "#6B7280"; // Default to gray if not found
    },
}