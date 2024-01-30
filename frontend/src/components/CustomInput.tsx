import React from "react";

type Props = {
    name: string,
    placeholder: string;
    type?: string;
    ref?: any;
    onChange?: (values: any) => void | undefined;
}

export const CustomInput = ({name, placeholder, ref, type = 'text', onChange} : Props) => {
    return (
        <input name={name} placeholder={placeholder} type={type} onChange={onChange} ref={ref}/>
    );
}