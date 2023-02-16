/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "light-blue": "rgb(228, 238, 250)",
                "dark-blue": {
                    400: "#0B2545",
                    800: "#06172B",
                },
                "dark-purple": "rgba(187, 134, 252, 0.5)",
            },
        },
    },
    plugins: [],
};
