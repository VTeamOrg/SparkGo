import { app_dark } from "../GStore";
import LoginBg from "../assets/login-bg.svg";
import LoginBgLight from "../assets/login-bg-light.svg";
import LoginBox from "../components/login/LoginBox";

const Login = () => {

    return (
        <section
            className={`${app_dark.value ? "bg-dark" : "bg-light"} w-full h-full`}
            style={{
                backgroundImage: `url(${app_dark.value ? LoginBg : LoginBgLight})`,
                backgroundSize: 'cover',
            }}
        >

            <LoginBox />

        </section>
    );
}

export default Login;