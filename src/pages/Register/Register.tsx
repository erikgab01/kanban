import { useState } from "react";
import UserService from "../../services/UserService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import InputWithFloatLabel from "../../components/InputWithFloatLabel";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { signup, updateProfileName } = useAuth();

    const formik = useFormik({
        initialValues: {
            user: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
        validationSchema: Yup.object({
            user: Yup.string()
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
            await updateProfileName(values.user);
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
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold">
                        Зарегистрировать аккаунт
                    </h2>
                </div>
                {checkAndDisplayErrors()}
                <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <InputWithFloatLabel
                        id="user"
                        label="Имя пользователя"
                        type="text"
                        placeholder=" "
                        isError={Boolean(formik.errors.user && formik.touched.user)}
                        {...formik.getFieldProps("user")}
                    />
                    <InputWithFloatLabel
                        id="email"
                        label="Почта"
                        type="email"
                        placeholder=" "
                        isError={Boolean(formik.errors.email && formik.touched.email)}
                        {...formik.getFieldProps("email")}
                    />
                    <InputWithFloatLabel
                        id="password"
                        label="Пароль"
                        type="password"
                        placeholder=" "
                        isError={Boolean(formik.errors.password && formik.touched.password)}
                        {...formik.getFieldProps("password")}
                    />
                    <InputWithFloatLabel
                        id="passwordConfirm"
                        label="Подтвердите пароль"
                        type="password"
                        placeholder=" "
                        isError={Boolean(
                            formik.errors.passwordConfirm && formik.touched.passwordConfirm
                        )}
                        {...formik.getFieldProps("passwordConfirm")}
                    />

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
