import { Link } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:text-white">
            <h1 className="font-medium text-xl text-center">Добро пожаловать</h1>
            <p className="text-lg text-center">
                Перед началом работы необходимо войти в свой аккаунт или зарегистрировать новый
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link
                    to={"/login"}
                    className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700 dark:bg-dark-purple dark:hover:bg-purple-800"
                >
                    Войти
                </Link>
                <Link
                    to={"/register"}
                    className="bg-sky-600 text-white rounded-md py-2 px-8 hover:bg-sky-700 dark:bg-dark-purple dark:hover:bg-purple-800"
                >
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    );
}
