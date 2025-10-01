const ConvexShape = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-20">
            <svg
                className="relative block w-full h-16 sm:h-20 md:h-24"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,0 C0,0 600,120 1200,0 L1200,120 L0,120 Z"
                    className="fill-background"
                />
            </svg>
        </div>
    )
}

export default ConvexShape