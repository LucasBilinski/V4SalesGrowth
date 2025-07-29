"use client"

import Marquee from "react-fast-marquee"

const companies = [
  "V4 Company",
  "XP Investimentos",
  "Grupo Boticário",
  "Brasil Paralelo",
  "Calvin Klein",
  "Riachuelo",
  "BTG Pactual",
  "Mahogany",
]

export function TrustedByCarousel() {
  return (
    <div className="relative w-full">
      <Marquee pauseOnHover gradient={false} speed={50}>
        {companies.map((name, index) => (
          <div key={index} className="mx-12 flex items-center justify-center h-16">
            <span className="text-2xl font-semibold uppercase tracking-wider text-zinc-500 transition-colors duration-300 cursor-default">
              {name}
            </span>
          </div>
        ))}
      </Marquee>
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}
