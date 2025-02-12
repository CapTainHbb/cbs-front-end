import React, {HTMLProps} from "react";


export default function IndeterminateCheckbox({
                                                  indeterminate,
                                                  className = '',
                                                  ...rest
                                              }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate, rest.checked])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={'form-check-input contactCheckBox'}
            style={{ width: '20px', height: '20px' }}
            {...rest}
        />
    )
}