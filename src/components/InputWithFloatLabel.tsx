interface InputWithFloatLabelProps {
    id: string;
    label: string;
    isError: boolean;
    [x: string]: any;
}

export default function InputWithFloatLabel({
    id,
    label,
    isError,
    ...rest
}: InputWithFloatLabelProps) {
    return (
        <div className="relative">
            <input
                id={id}
                className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-gray-50 border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:bg-dark-blue-400 dark:focus:border-dark-purple ${
                    isError ? "border-red-500" : "border-gray-300"
                }`}
                {...rest}
            />
            <label
                htmlFor={id}
                className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                    isError ? "text-red-500" : "text-gray-500"
                }`}
            >
                {label}
            </label>
        </div>
    );
}
