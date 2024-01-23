import LoginBg from "../assets/login-bg.svg";
import LoginBgLight from "../assets/login-bg-light.svg";
import LoginBox from "../components/login/LoginBox";
import { appSettingsStore } from "../GStore";
const Login = () => {
    return (
        <section
            className={`bg-bg_color-2 w-full h-full`}
            style={{
                backgroundImage: `url(${appSettingsStore.value.style === "dark" ? LoginBg : LoginBgLight})`,
                backgroundSize: 'cover',
            }}
        >

            <LoginBox />

        </section>
    );
}

export default Login;