import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import InputWithFloatLabel from "../../components/InputWithFloatLabel";
import { useFormik } from "formik";

export default function Login() {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { login } = useAuth();

    async function handleSubmit(values: typeof formik.values) {
        setLoading(true);
        try {
            await login(values.email, values.password, values.rememberMe);
            navigate(from, { replace: true });
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
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <InputWithFloatLabel
                        id="email"
                        label="Почта"
                        type="email"
                        placeholder=" "
                        isError={false}
                        {...formik.getFieldProps("email")}
                    />
                    <InputWithFloatLabel
                        id="password"
                        label="Пароль"
                        type="password"
                        placeholder=" "
                        isError={false}
                        {...formik.getFieldProps("password")}
                    />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600 dark:accent-dark-purple"
                                {...formik.getFieldProps("rememberMe")}
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link
                                to={"/reset"}
                                className="font-medium text-sky-600 hover:text-sky-500 dark:text-dark-purple dark:hover:text-purple-400"
                            >
                                Забыли пароль?
                            </Link>
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
