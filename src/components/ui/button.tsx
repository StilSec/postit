import * as React from "react"
import { cn } from "@/lib/utils"

//Custom button component to be reused throughout the application
const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

const buttonVariantClasses = {
  default: "bg-milkshake text-black hover:bg-tangerine",
  ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
} as const

const buttonSizeClasses = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  icon: "size-9",
} as const

type ButtonVariant = keyof typeof buttonVariantClasses
type ButtonSize = keyof typeof buttonSizeClasses

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(
    buttonBase,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className
  )
}

interface ButtonProps
  extends React.ComponentProps<"button"> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = buttonVariants({ variant, size, className })

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>

    return React.cloneElement(child, {
      ...props,
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(classes, child.props.className),
    })
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }