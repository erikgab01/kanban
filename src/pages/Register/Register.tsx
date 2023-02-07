import { useState } from "react";
import UserService from "../../services/UserService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { signup, updateProfileName } = useAuth();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .max(15, "Имя пользователя должно быть меньше 15 символов")
                .required("Имя пользователя обязательно"),
            email: Yup.string().email("Неверный формат почты").required("Почта обязательна"),
            password: Yup.string()
                .required("Пароль обязателен")
                .matches(/^\S*$/, "В пароле не может быть пробелов")
                .matches(/^[\x20-\x7E]+$/, "Пароль должен содержать только латинские символы")
                .min(8, "Пароль должен быть минимум 8 символов")
                .matches(/^(?=.*[A-Z])/, "Пароль должен содержать хотя бы одну заглавную букву"),
            passwordConfirm: Yup.string()
                .required("Подтвердите пароль")
                .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    async function handleSubmit(values: typeof formik.values) {
        setLoading(true);
        try {
            const userCredential = await signup(values.email, values.password);
            await updateProfileName(values.username);
            // Add user to firestore
            await UserService.addUserToFirestore(
                userCredential.user.uid,
                userCredential.user.displayName!,
                userCredential.user.email!
            );
            navigate("/");
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") toast.error("Почта уже используется");
            else toast.error("Ошибка при создании аккаунта");
        }
        setLoading(false);
    }

    function checkAndDisplayErrors() {
        const errorsArray = (Object.keys(formik.errors) as Array<keyof typeof formik.errors>).map(
            (key) => (formik.errors[key] !== "" && formik.touched[key] ? formik.errors[key] : "")
        );
        if (errorsArray.filter((error) => error !== "").length === 0) {
            return null;
        }
        return (
            <div
                className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg sm:text-sm dark:bg-red-200 dark:text-red-800"
                role="alert"
            >
                <ul>
                    {errorsArray.map((error) =>
                        error ? (
                            <li key={error} className="list-inside list-disc">
                                {error}
                            </li>
                        ) : null
                    )}
                </ul>
            </div>
        );
    }
    //TODO: decompose input element
    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Зарегистрировать аккаунт
                    </h2>
                </div>
                {checkAndDisplayErrors()}
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <input type="hidden" name="remember" value="true" />

                    <div className="relative">
                        <input
                            type="text"
                            id="username"
                            className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                                formik.errors.username && formik.touched.username
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder=" "
                            {...formik.getFieldProps("username")}
                        />
                        <label
                            htmlFor="username"
                            className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                                formik.errors.username && formik.touched.username
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }`}
                        >
                            Имя пользователя
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                                formik.errors.email && formik.touched.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder=" "
                            {...formik.getFieldProps("email")}
                        />
                        <label
                            htmlFor="email"
                            className={`absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                                formik.errors.email && formik.touched.email
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }`}
                        >
                            Почта
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            id="password"
                            className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                                formik.errors.password && formik.touched.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder=" "
                            {...formik.getFieldProps("password")}
                        />
                        <label
                            htmlFor="password"
                            className={`absolute text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                                formik.errors.password && formik.touched.password
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }`}
                        >
                            Пароль
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            type="password"
                            id="passwordConfirm"
                            className={`block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
                                formik.errors.passwordConfirm && formik.touched.passwordConfirm
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder=" "
                            {...formik.getFieldProps("passwordConfirm")}
                        />
                        <label
                            htmlFor="passwordConfirm"
                            className={`absolute text-sm dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                                formik.errors.passwordConfirm && formik.touched.passwordConfirm
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }`}
                        >
                            Подтвердите пароль
                        </label>
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
