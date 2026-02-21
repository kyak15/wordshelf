import { ReactNode } from "react";

interface BlankCardProps {
  className?: string;
  children: ReactNode
}

export default function BlankCard({className, children}:BlankCardProps) {
    
    return (
        <div className={className}>
            {children}
        </div>
    )
}
