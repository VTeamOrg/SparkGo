import { useCookies } from "react-cookie";
import LoginBg from "../assets/login-bg.svg";
import LoginBgLight from "../assets/login-bg-light.svg";
import LoginBox from "../components/login/LoginBox";

const Login = () => {
    const [cookies] = useCookies();

    return (
        <section
            className={`${cookies.app_dark ? "bg-dark" : "bg-light"} w-full h-full`}
            style={{
                backgroundImage: `url(${cookies.app_dark ? LoginBg : LoginBgLight})`,
                backgroundSize: 'cover',
            }}
        >

            <LoginBox />

        </section>
    );
}

export default Login;