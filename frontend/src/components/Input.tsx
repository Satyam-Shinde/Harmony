import { forwardRef, type InputHTMLAttributes } from 'react';
interface Props extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; hint?: string; }
const Input = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className = '', ...rest }, ref) => (
  <div className="w-full">
    {label && <label className="label">{label}</label>}
    <input ref={ref} className={`input ${error ? 'input-error' : ''} ${className}`} {...rest} />
    {error && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--error)' }}>{error}</p>}
    {hint && !error && <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{hint}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
