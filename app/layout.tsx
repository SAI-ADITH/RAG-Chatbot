import "./global.css"

export const metadata = {
    title: "TennisGPT",
    description: "The place to go for all your Tennis Questions!"
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
};


export default RootLayout