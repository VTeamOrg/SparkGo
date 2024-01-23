/**
 * Represents a container template for displaying information about an area on a map when clicked.
 * @param {object} props - The props for the AreaMsgContainer component.
 * @param {string} props.svgIcon - The URL of the SVG icon representing the area.
 * @param {string} props.title - The title or name of the area.
 * @param {string} props.text - The descriptive text or details about the area.
 * @returns {JSX.Element} - Returns the JSX for the AreaMsgContainer component.
 */

const AreaMsgContainer = ({ svgIcon, title, text }) => {
    return (
        <div className="flex gap-4">
            <img src={svgIcon} alt="icon" className="w-16" />
            <div className={`text-text_color-2`}>
                <h1 className={`text-accent-1 text-base font-bold`}>{title}</h1>
                <p className="text-sm">{text}</p>
            </div>
        </div>
    );
};

export default AreaMsgContainer;
