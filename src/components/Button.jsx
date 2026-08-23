import './Button.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'start',
  className = '',
  children,
  ...rest
}) {
  return (
    <Component className={`btn btn--${variant} btn--${size} ${className}`} {...rest}>
      {icon && iconPosition === 'start' && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__label">{children}</span>}
      {icon && iconPosition === 'end' && <span className="btn__icon">{icon}</span>}
    </Component>
  );
}
