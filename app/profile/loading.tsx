export default function Loading() {
  return(
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="flip-animation"
      >
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="white"
          strokeWidth="5"
        />
        <image
          href="https://i.imgur.com/OUJwAtI.png"
          x="30"
          y="30"
          width="240"
          height="240"
        />
      </svg>

      <style>
      
      </style>
    </div>

  
  )
}
