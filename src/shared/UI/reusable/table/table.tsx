"use client"

import { cn } from "@/shared/lib/utils/cn"
import * as React from "react"



type TableProps = React.ComponentProps<"table"> & {
    containerClassName?: string
    dragScrollMode?: "none" | "x" | "both"
}

function isInteractiveTarget(target: EventTarget | null) {
    if (!(target instanceof Element)) return false

    return Boolean(
        target.closest(
            "a, button, input, select, textarea, label, summary, [role='button'], [data-no-table-drag='true']"
        )
    )
}

/**
 * Determines the dominant direction of a pointer gesture.
 * Returns "x" if horizontal movement is dominant, "y" if vertical, null if not enough movement.
 */
function getDominantAxis(deltaX: number, deltaY: number, threshold = 8): "x" | "y" | null {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX < threshold && absY < threshold) return null

    return absX >= absY ? "x" : "y"
}

function getTouchAction(dragScrollMode: "none" | "x" | "both", overflowX: boolean, overflowY: boolean): string {
    if (dragScrollMode === "none") return "auto"

    if (dragScrollMode === "x") {
        return overflowX ? "pan-x" : "auto"
    }

    // dragScrollMode === "both"
    const allowX = overflowX
    const allowY = overflowY

    if (allowX && allowY) return "pan-x pan-y"
    if (allowX) return "pan-x"
    if (allowY) return "pan-y"
    return "auto"
}

/** Damping factor for mouse drag scroll (0–1). Lower = slower/smoother scroll. */
const SCROLL_DAMPING = 0.5

function Table({
    className,
    containerClassName,
    dragScrollMode = "x",
    ...props
}: TableProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const dragStateRef = React.useRef({
        pointerId: null as number | null,
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
        moved: false,
        active: false,
    })
    /** Locked axis for the current gesture (mouse only). null = not yet locked. */
    const lockedAxisRef = React.useRef<"x" | "y" | null>(null)
    const suppressClickRef = React.useRef(false)
    const [overflowState, setOverflowState] = React.useState({
        x: false,
        y: false,
    })
    const [isDragging, setIsDragging] = React.useState(false)

    const touchAction = React.useMemo(
        () => getTouchAction(dragScrollMode, overflowState.x, overflowState.y),
        [dragScrollMode, overflowState.x, overflowState.y]
    )

    const updateOverflowState = React.useCallback(() => {
        const container = containerRef.current
        if (!container) return

        setOverflowState({
            x: container.scrollWidth > container.clientWidth + 1,
            y: container.scrollHeight > container.clientHeight + 1,
        })
    }, [])

    const stopDragging = React.useCallback(() => {
        dragStateRef.current.active = false
        dragStateRef.current.pointerId = null
        suppressClickRef.current = dragStateRef.current.moved
        dragStateRef.current.moved = false
        lockedAxisRef.current = null
        setIsDragging(false)

        document.body.style.userSelect = ""
    }, [])

    React.useEffect(() => {
        updateOverflowState()

        const container = containerRef.current
        if (!container) return

        const table = container.querySelector("table")
        const observer = new ResizeObserver(() => {
            updateOverflowState()
        })

        observer.observe(container)

        if (table instanceof HTMLElement) {
            observer.observe(table)
        }

        return () => {
            observer.disconnect()
            document.body.style.userSelect = ""
        }
    }, [props.children, updateOverflowState])

    const handlePointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.pointerType === "mouse" && event.button !== 0) return
            // Keep native touch scrolling so mobile swipes retain momentum/inertia.
            if (event.pointerType !== "mouse") return

            const canDragX =
                dragScrollMode !== "none" &&
                (dragScrollMode === "x" || dragScrollMode === "both") &&
                overflowState.x
            const canDragY =
                dragScrollMode === "both" &&
                overflowState.y

            if (!canDragX && !canDragY) return
            if (event.pointerType === "mouse" && isInteractiveTarget(event.target)) return

            const container = containerRef.current
            if (!container) return

            dragStateRef.current.pointerId = event.pointerId
            dragStateRef.current.startX = event.clientX
            dragStateRef.current.startY = event.clientY
            dragStateRef.current.scrollLeft = container.scrollLeft
            dragStateRef.current.scrollTop = container.scrollTop
            dragStateRef.current.moved = false
            dragStateRef.current.active = true
            lockedAxisRef.current = null

            container.setPointerCapture(event.pointerId)
            document.body.style.userSelect = "none"
            setIsDragging(true)

            if (event.pointerType === "mouse") {
                event.preventDefault()
            }
        },
        [dragScrollMode, overflowState.x, overflowState.y]
    )

    const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const container = containerRef.current
        const dragState = dragStateRef.current

        if (!container || !dragState.active || dragState.pointerId !== event.pointerId) {
            return
        }

        const deltaX = event.clientX - dragState.startX
        const deltaY = event.clientY - dragState.startY

        if (!dragState.moved && (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4)) {
            dragState.moved = true
        }

        if (!dragState.moved) {
            return
        }

        // --- Direction locking for mouse drag ---
        // For mouse with "both" mode, lock to the dominant axis so diagonal dragging is prevented.
        if (event.pointerType === "mouse" && dragScrollMode === "both") {
            if (lockedAxisRef.current === null) {
                lockedAxisRef.current = getDominantAxis(deltaX, deltaY, 10)
            }

            const lockedAxis = lockedAxisRef.current

            if (lockedAxis === "x") {
                container.scrollLeft = dragState.scrollLeft - deltaX * SCROLL_DAMPING
            } else if (lockedAxis === "y") {
                container.scrollTop = dragState.scrollTop - deltaY * SCROLL_DAMPING
            }

            event.preventDefault()
            return
        }
        // --- End direction locking ---

        if (dragScrollMode === "x" || dragScrollMode === "both") {
            container.scrollLeft = dragState.scrollLeft - deltaX * SCROLL_DAMPING
        }

        if (dragScrollMode === "both") {
            container.scrollTop = dragState.scrollTop - deltaY * SCROLL_DAMPING
        }

        event.preventDefault()
    }, [dragScrollMode])

    const handlePointerUp = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const container = containerRef.current
            const pointerId = dragStateRef.current.pointerId

            if (!container || pointerId !== event.pointerId) {
                return
            }

            if (container.hasPointerCapture(event.pointerId)) {
                container.releasePointerCapture(event.pointerId)
            }

            stopDragging()
        },
        [stopDragging]
    )

    const handleClickCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!suppressClickRef.current) return

        suppressClickRef.current = false
        event.preventDefault()
        event.stopPropagation()
    }, [])

    return (
        <div
            ref={containerRef}
            data-slot="table-container"
            className={cn(
                "relative w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [-webkit-overflow-scrolling:touch]",
                dragScrollMode !== "none" && (overflowState.x || overflowState.y) && "cursor-grab",
                isDragging && "cursor-grabbing select-none",
                containerClassName
            )}
            style={{ touchAction }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onLostPointerCapture={handlePointerUp}
            onClickCapture={handleClickCapture}
            onDragStart={(event) => event.preventDefault()}
        >
            <table
                data-slot="table"
                className={cn("w-full caption-bottom text-sm", className)}
                {...props}
            />
        </div>
    )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <thead
            data-slot="table-header"
            className={cn("[&_tr]:border-b", className)}
            {...props}
        />
    )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
                className
            )}
            {...props}
        />
    )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
                className
            )}
            {...props}
        />
    )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    )
}

function TableCaption({
    className,
    ...props
}: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("text-muted-foreground mt-4 text-sm", className)}
            {...props}
        />
    )
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}