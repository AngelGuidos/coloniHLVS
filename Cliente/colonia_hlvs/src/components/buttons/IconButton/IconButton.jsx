import './IconButton.css';

function IconButton({ icon, onClick, text, disabled, className }) {
    const buttonClass = disabled ? 'disabled' : 'enabled';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`slim_button ${buttonClass} ${className}`}>
            {icon}
            {text}
        </button>
    )
}

export default IconButton;