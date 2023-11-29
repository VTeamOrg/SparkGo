import notFoundGif from '../assets/not-found.gif';

const PageNotFound = ({ customText, customCode }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <img src={notFoundGif} alt="Page Not Found GIF" className="max-w-sm md:max-w-lg mt-6" />
            <div className="text-center">
                <h1 className="text-6xl text-primary">{customCode ?? "404"}</h1>
                <p className="text-xl text-primary">{customText ?? "Page Not Found"}</p>
            </div>
        </div>
    );
};

export default PageNotFound;
