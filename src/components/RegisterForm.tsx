import React, { useRef, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { addUserToFirestore } from "../api/userService";

export default function RegisterForm() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { signup, updateProfileName } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: maybe some form validation (react-hook-form)
        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError("Пароли не совпадают");
        }
        setLoading(true);
        try {
            if (emailRef.current && passwordRef.current && usernameRef.current) {
                const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
                await updateProfileName(usernameRef.current.value);
                // Add user to firestore
                await addUserToFirestore(
                    userCredential.user.uid,
                    userCredential.user.displayName!,
                    userCredential.user.email!
                );
                navigate("/");
            }
        } catch (error: any) {
            if (error.code === "auth/weak-password") setError("Пароль слишком короткий. Минимум 6 символов");
            else if (error.code === "auth/email-already-in-use") setError("Почта уже используется");
            else setError("Ошибка при создании аккаунта");
        }
        setLoading(false);
    }

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Зарегистрировать аккаунт
                    </h2>
                </div>
                {error && (
                    <div
                        className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg sm:text-sm dark:bg-red-200 dark:text-red-800"
                        role="alert"
                    >
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Имя пользователя
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                ref={usernameRef}
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Имя пользователя"
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Почта
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                ref={emailRef}
                                required
                                className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-600 focus:outline-none focus:ring-sky-600 sm:text-sm"
                                placeholder="Почта"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
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
                            <label htmlFor="password-confirmation" className="sr-only">
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
                            disabled={loading}
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
                                        fillRule="evenodd"
                                        d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                            Зарегистрироваться
                            {loading && (
                                <span className="absolute right-0 pr-3 flex items-center" role="status">
                                    <svg
                                        aria-hidden="true"
                                        className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
