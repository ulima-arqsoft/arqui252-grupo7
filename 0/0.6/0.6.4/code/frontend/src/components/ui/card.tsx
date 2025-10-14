import * as React from 'react'
import { cn } from '../../utils'


export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('bg-card text-card-foreground rounded-xl border', className)} {...props} />
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-6 pt-6', className)} {...props} />
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <h4 className={cn('text-lg font-semibold leading-none', className)} {...props} />
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <p className={cn('text-sm text-gray-600', className)} {...props} />
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('px-6 pb-6', className)} {...props} />
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('flex items-center px-6 pb-6', className)} {...props} />
}