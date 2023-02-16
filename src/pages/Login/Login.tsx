import React, { useRef, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

// TODO: forget password
export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const remember = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            if (emailRef.current && passwordRef.current && remember.current) {
                await login(
                    emailRef.current.value,
                    passwordRef.current.value,
                    remember.current.checked
                );
                navigate(from, { replace: true });
            }
        } catch {
            setError("Неправильный логин или пароль");
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold">Войти в свой аккаунт</h2>
                </div>
                {error && (
                    <div
                        className="p-4 text-red-700 bg-red-100 rounded-lg sm:text-sm dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />

                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className={
                                "block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-smbg-gray-50 border-0 border-b-2 appearance-none dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:bg-dark-blue-400 dark:focus:border-dark-purple"
                            }
                            placeholder=" "
                            ref={emailRef}
                        />
                        <label
                            htmlFor="email"
                            className={
                                "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                            }
                        >
                            Почта
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer dark:bg-dark-blue-400 dark:focus:border-dark-purple"
                            placeholder=" "
                            ref={passwordRef}
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
                        >
                            Пароль
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                ref={remember}
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 dark:accent-dark-purple"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <button className="font-medium text-sky-600 hover:text-sky-500 dark:text-dark-purple dark:hover:text-purple-400">
                                Забыли пароль?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:bg-dark-purple dark:hover:bg-purple-800"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-sky-500 group-hover:text-sky-400 dark:text-gray-300 dark:group-hover:text-gray-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            Войти
                            {loading && (
                                <span className="absolute right-0 pr-3 flex items-center">
                                    <span className="w-4 h-4">
                                        <LoadingSpinner />
                                    </span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
