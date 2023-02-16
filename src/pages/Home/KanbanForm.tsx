import { useRef } from "react";

interface KanbanFormProps {
    handler: (name: string, desc: string) => void;
    formTitle: string;
    buttonText: string;
    initialName?: string;
    initialDesc?: string;
}

export function KanbanForm({
    handler,
    formTitle,
    buttonText,
    initialName = "",
    initialDesc = "",
}: KanbanFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    return (
        <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium">{formTitle}</h3>
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (titleRef.current && descRef.current) {
                        handler(titleRef.current.value, descRef.current.value);
                    }
                }}
            >
                <div>
                    <label htmlFor="title" className="block mb-2 text-sm font-medium">
                        Название
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-slate-400 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm dark:bg-dark-blue-400 dark:focus:border-dark-purple dark:border-slate-500"
                        placeholder="Моя доска"
                        defaultValue={initialName}
                        ref={titleRef}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">
                        Краткое описание (необязательно)
                    </label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-slate-400 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm dark:bg-dark-blue-400 dark:focus:border-dark-purple dark:border-slate-500"
                        placeholder="Для работы над проектом"
                        defaultValue={initialDesc}
                        ref={descRef}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-dark-purple dark:hover:bg-purple-800"
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
}
