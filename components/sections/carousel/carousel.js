import React, { useState, useEffect, useCallback } from "react"
import { useEmblaCarousel } from "embla-carousel/react"
import { useRecursiveTimeout } from "./useRecursiveTimeout"
import Image from "next/image"
import Card from "@material-ui/core/Card"
import { makeStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import { DotButton } from "./buttons"

const AUTOPLAY_INTERVAL = 8000

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 400,
  },
})

const EmblaCarousel = ({ data }) => {
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
  const [scrollSnaps, setScrollSnaps] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const classes = useStyles()
  const autoplay = useCallback(() => {
    if (!embla) return
    if (embla.canScrollNext()) {
      embla.scrollNext()
    } else {
      embla.scrollTo(0)
    }
  }, [embla])

  const onSelect = useCallback(() => {
    if (!embla) return
    setSelectedIndex(embla.selectedScrollSnap())
  }, [embla, setSelectedIndex])
  const scrollTo = useCallback(
    (index) => embla && embla.scrollTo(index),
    [embla]
  )

  const { play, stop } = useRecursiveTimeout(autoplay, AUTOPLAY_INTERVAL)

  useEffect(() => {
    if (!embla) return
    embla.on("select", onSelect)
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
  }, [embla, onSelect, setScrollSnaps])

  useEffect(() => {
    play()
  }, [play])

  function createMarkup(data) {
    return { __html: data }
  }

  return (
    <div
      className="embla"
      ref={viewportRef}
      style={{
        color: "#373a3c",
        marginTop: "44px",
      }}
    >
      <div className="embla__container">
        {data.slide.map((slide, i) => {
          return (
            <div className="embla__slide container" key={slide.header + i}>
              <Card
                className="flex flex-col md:flex-row items-center justify-between"
                style={{ minHeight: "500px", background: "#0000000a" }}
              >
                <div className="flex flex-wrap lg:flex-nowrap lg:p-14">
                  <div className="flex-shrink-0 w-full lg:w-6/12 lg:p-14">
                    <a
                      href={slide.url}
                      target="_blank"
                      rel="noreferrer"
                      className="img-fix"
                    >
                      <Image
                        width="800px"
                        height="500px"
                        layout="intrinsic"
                        src={slide.img.url}
                        alt="img"
                      />
                    </a>
                  </div>
                  {/* Left column for content */}
                  <CardContent>
                    {/* label */}
                    <p className="uppercase mb-4 tracking-wide font-semibold text-magenta text-center lg:text-left">
                      {slide.smallheader}
                    </p>
                    {/* Big title */}
                    <h1 className="title mb-4 text-center lg:text-left">
                      {slide.header}
                    </h1>
                    {/* Description paragraph */}
                    <div className="text-xl mb-4 text-grey text-center pl-10 pr-10 lg:text-left lg:pl-0 lg:pr-0">
                      <p
                        dangerouslySetInnerHTML={createMarkup(slide.paragraph)}
                      />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
      <div className="embla__dots pb-4 pt-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default EmblaCarousel
