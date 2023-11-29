import { FcGoogle } from "react-icons/fc";
import Button from "../Button";
/**
 * LoginBox Component
 *
 * The LoginBox component is a UI component representing a login box with branding,
 * a title, and a "Continue with Google" button. It handles the login functionality.
 *
 * @component
 * @example
 * // Usage in another component or container
 * import LoginBox from './LoginBox';
 *
 * const Login = () => {
 *   return (
 *     <div>
 *       <LoginBox />
 *       ...
 *     </div >
 *   );
 * };
  */
const LoginBox = () => {

    return (
        <div className="w-full flex flex-col gap-16 items-center absolute left-2/4 top-[40%] translate-x-[-50%] translate-y-[-40%]">
            <div className="text-center flex flex-col gap-3">
                <h1 className="font-bold text-4xl">
                    <span className={`text-text_color`}>
                        Spark
                    </span>
                    <span className={`text-accent-1 bg-bg_color`}>
                        GO
                    </span>
                </h1>

                <p className={`font-semibold italic text-2xl text-text_color`}>
                    Your Two-Wheeled <br /> Adventure
                </p>
            </div>

            <Button>
                <FcGoogle className="text-5xl" />
                <p className={`font-bold text-black text-xl text-text_color`}>Continue with Google</p>
            </Button>
        </div>
    );
}

export default LoginBox;
