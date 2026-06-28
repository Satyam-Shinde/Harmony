import { forwardRef, type TextareaHTMLAttributes } from 'react';
interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string; }
const TextArea = forwardRef<HTMLTextAreaElement, Props>(({ label, error, className = '', ...rest }, ref) => (
  <div className="w-full h-full flex flex-col">
    {label && <label className="label">{label}</label>}
    <textarea ref={ref} className={`input resize-none flex-1 ${error ? 'input-error' : ''} ${className}`} style={{ lineHeight: '1.7' }} {...rest} />
    {error && <p className="mt-1 text-xs font-medium" style={{ color: 'var(--error)' }}>{error}</p>}
  </div>
));
TextArea.displayName = 'TextArea';
export default TextArea;
