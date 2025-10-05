export default function XIcon({ size = 24 }: { size?: number }) {

    return (
        <svg
            width={size + "px"}
            height={size + "px"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 6L6 18M6 6L18 18"
            />
        </svg>
    )
}
