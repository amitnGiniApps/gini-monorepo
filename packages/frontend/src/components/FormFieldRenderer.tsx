import { useFormContext } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

export default function FormFieldRenderer({ field }: { field: unknown }) {
    const { register, setValue } = useFormContext();
    const formData = useWatch();

    const handleCardSelect = (id: string, value: string) => {
        const current = formData[id] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        setValue(id, updated);
    };

    const { id, label, type, options, placeholder, accept } = field;

    if (type === 'text' || type === 'color') {
        return (
            <div className="form-group">
                <label>{label}</label>
                <input
                    {...register(id)}
                    type={type}
                    placeholder={placeholder}
                    className="form-input"
                />
            </div>
        );
    }

    if (type === 'select' || type === 'checkbox-group') {
        const selected = formData[id] || [];
        return (
            <div className="form-group">
                <label>{label}</label>
                <div className="card-grid">
                    {options.map((opt: unknown) => {
                        const value = typeof opt === 'string' ? opt : opt.id;
                        const optLabel = typeof opt === 'string' ? opt : opt.label;
                        const isActive = selected.includes(value);
                        return (
                            <div
                                key={value}
                                className={`card ${isActive ? 'active' : ''}`}
                                onClick={() => handleCardSelect(id, value)}
                            >
                                {optLabel}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (type === 'file') {
        return (
            <div className="form-group">
                <label>{label}</label>
                <input type="file" accept={accept} {...register(id)} />
            </div>
        );
    }

    if (type === 'group') {
        return (
            <div className="form-group">
                <label>{label}</label>
                {field.fields.map((nestedField: unknown) => (
                    <FormFieldRenderer key={nestedField.id} field={nestedField} />
                ))}
            </div>
        );
    }

    if (type === 'repeater') {
        const selectedFields = formData[id] || [];
        return (
            <div className="form-group">
                <label>{label}</label>
                {selectedFields.map((_field: unknown, index: number) => (
                    <div key={index} className="repeater-item">
                        {field.fields.map((nestedField: unknown) => (
                            <FormFieldRenderer key={nestedField.id} field={nestedField} />
                        ))}
                    </div>
                ))}
                <button
                    type="button"
                    className="btn secondary"
                    onClick={() => setValue(id, [...selectedFields, {}])}
                >
                    Add New {field.label}
                </button>
            </div>
        );
    }

    return null;
}
