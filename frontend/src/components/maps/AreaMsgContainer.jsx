import { app_dark } from "../../GStore";

const AreaMsgContainer = ({svgIcon, title, text}) => {
    return (
        <div className="flex gap-4">
            <img src={svgIcon} alt="icon"  className="w-16"/>
            <div className={`${app_dark.value && "text-light"}`}>
                <h1 className={`${app_dark.value && "text-primary"} text-base font-bold`}>{title}</h1>
                <p className="text-sm">{text}</p>
            </div>
        </div>
    );
}

export default AreaMsgContainer;