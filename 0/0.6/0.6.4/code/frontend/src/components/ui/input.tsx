import * as React from 'react'
import { cn } from '../../utils'


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }


export function Input({ className, type, ...props }: InputProps) {
    return (
        <input
            type={type}
            className={cn(
                'placeholder:text-gray-500 selection:bg-primary selection:text-primary-foreground border-input flex h-10 w-full rounded-md border px-3 py-2 text-base bg-white transition outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm',
                className,
            )}
            {...props}
        />
    )
}