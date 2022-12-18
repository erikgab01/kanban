import React, { useRef, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { signup } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Пароли не совпадают");
        }
        try {
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/kanban/1");
        } catch {
            setError("Ошибка при создании аккаунта");
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Зарегистрировать аккаунт
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label for="username" className="sr-only">
                                Имя пользователя
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Имя пользователя"
                            />
                        </div>
                        <div>
                            <label for="email-address" className="sr-only">
                                Почта
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autocomplete="email"
                                ref={emailRef}
                                required
                                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Почта"
                            />
                        </div>
                        <div>
                            <label for="password" className="sr-only">
                                Пароль
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                ref={passwordRef}
                                required
                                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Пароль"
                            />
                        </div>
                        <div>
                            <label for="password-confirmation" className="sr-only">
                                Подтвердите пароль
                            </label>
                            <input
                                id="password-confirmation"
                                name="password-confirmation"
                                type="password"
                                ref={passwordConfirmRef}
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Подтвердите пароль"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-sky-500 group-hover:text-sky-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
