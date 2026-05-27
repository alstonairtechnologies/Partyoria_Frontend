"use client"

import { cn } from "@/lib/utils"
import React, { useState, createContext, useContext } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return <SidebarContext.Provider value={{ open, setOpen, animate }}>{children}</SidebarContext.Provider>
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar className={props.className}>{props.children as React.ReactNode}</MobileSidebar>
    </>
  )
}

export const DesktopSidebar = ({ className, children, ...props }: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <motion.div
      className={cn(
        "h-full hidden md:flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 w-[280px] flex-shrink-0 border-r border-slate-100 dark:border-slate-800 shadow-sm",
        className,
      )}
      animate={{
        width: animate ? (open ? "280px" : "80px") : "280px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <div className="flex-1 overflow-y-auto px-2 pt-2">
        {children as React.ReactNode}
      </div>
    </motion.div>
  )
}

export const MobileSidebar = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const { open, setOpen } = useSidebar()
  return (
    <div className="md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed inset-0 bg-white dark:bg-slate-950 z-[100] overflow-y-auto",
              className,
            )}
          >
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Partyoria
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
}) => {
  const { open, setOpen, animate } = useSidebar()
  
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setOpen(false)
    }
  }
  
  const isActive = false // We'll handle this through the parent component
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 group/sidebar py-2 px-3 rounded-lg transition-all duration-200 text-brand-purple hover:text-brand-purple bg-white cursor-pointer",
        "relative overflow-hidden",
        isActive && "text-brand-purple bg-white",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white text-brand-purple transition-colors",
        isActive && "text-brand-purple bg-white"
      )}>
        {link.icon}
      </div>
      <motion.span
        animate={{
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        style={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          width: animate ? (open ? 'auto' : '0') : 'auto',
        }}
        className="text-sm font-medium whitespace-nowrap transition-all duration-200"
      >
        {link.label}
      </motion.span>
      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-lg transition-opacity duration-200"
        style={{
          opacity: isActive ? 1 : 0,
          display: animate ? (open ? 'block' : 'none') : 'block',
        }}
      />
    </div>
  )
}