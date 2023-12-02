/**
 * Button Component
 *
 * The Button component is a reusable UI component representing a button with flexible styling.
 *
 * @component
 * @param {object} props - The properties passed to the Button component.
 * @param {ReactNode} props.children - The content inside the button.
 * @param {function} props.onClick - The function to be called when the button is clicked.
 * @param {string} props.className - Additional classes to be applied to the button.
 * @returns {JSX.Element} - A button element with flexible styling.
 *
 * @example
 * // Usage in another component or container
 * import Button from './Button';
 *
 * const MyComponent = () => {
 *   const handleClick = () => {
 *     // Add your button click logic here
 *     console.log("Button clicked!");
 *   };
 *
 *   return (
 *     <Button onClick={handleClick} className="custom-class">
 *       Click me!
 *     </Button>
 *   );
 * };
 */

const Button = ({ children, onClick, className })=> {
    return (
        <button onClick={onClick} className={`${className ?? ""} flex items-center gap-2 p-3 bg-transparent border-2 border-primary rounded-3xl`}>{children}</button>
    );
}

export default Button;
