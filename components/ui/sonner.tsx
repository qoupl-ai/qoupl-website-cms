"use client"

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#212121] group-[.toaster]:text-white group-[.toaster]:border-[#2a2a2a] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#898989]",
          actionButton:
            "group-[.toast]:bg-[#212121] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-[#171717] group-[.toast]:text-[#898989]",
        },
        style: {
          background: '#212121',
          border: '1px solid #2a2a2a',
          color: '#ffffff',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
