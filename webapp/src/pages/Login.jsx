import { curr_theme } from "../GStore";
import LoginBg from "../assets/login-bg.svg";
import LoginBgLight from "../assets/login-bg-light.svg";
import LoginBox from "../components/login/LoginBox";

const Login = () => {
    return (
        <section
            className={`bg-bg_color w-full h-full`}
            style={{
                backgroundImage: `url(${curr_theme.value === "dark" ? LoginBg : LoginBgLight})`,
                backgroundSize: 'cover',
            }}
        >

            <LoginBox />

        </section>
    );
}

export default Login;
