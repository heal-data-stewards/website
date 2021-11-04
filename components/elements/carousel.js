import React, { useState, useEffect, useCallback } from "react"
import { useEmblaCarousel } from "embla-carousel/react"
import { useRecursiveTimeout } from "./carousel/useRecursiveTimeout"
import Image from "next/image"
import Card from "@material-ui/core/Card"
import CardMedia from "@material-ui/core/CardMedia"
import CardActionArea from "@material-ui/core/CardActionArea"
import { makeStyles } from "@material-ui/core/styles"
import CardContent from "@material-ui/core/CardContent"
import { DotButton } from "./carousel/buttons"
import Link from "next/link"
import styled from "styled-components"

const AUTOPLAY_INTERVAL = 6000

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 400,
  },
})
const BlueLink = styled.a`
  color: blue;
`

const PrevButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--prev"
    onClick={onClick}
    disabled={!enabled}
    style={{ width: "20px" }}
  >
    <svg className="embla__button__svg" viewBox="137.718 -1.001 366.563 644">
      <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" />
    </svg>
  </button>
)

const NextButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--next"
    onClick={onClick}
    disabled={!enabled}
    style={{ width: "35px" }}
  >
    <svg className="embla__button__svg" viewBox="0 0 238.003 238.003">
      <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" />
    </svg>
  </button>
)

export const EmblaCarousel = ({ data }) => {
  const [viewportRef, embla] = useEmblaCarousel({ skipSnaps: false })
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
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
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
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
        <div className="embla__slide container">
          <Card
            className="flex flex-col md:flex-row items-center justify-between"
            style={{ minHeight: "500px", background: "#0000000a" }}
          >
            <div className="flex flex-wrap lg:flex-nowrap lg:p-14">
              <div className="flex-shrink-0 w-full lg:w-6/12 lg:p-14">
                <a
                  href="https://healdata.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="img-fix"
                >
                  <Image
                    width="800px"
                    height="500px"
                    layout="intrinsic"
                    src={
                      // "https://heal-community-portal-api.s3.amazonaws.com/small_carousel2_c0d502c422.jpeg"
                      "https://heal-community-portal-api.s3.amazonaws.com/3slide_d5a412f975.jpeg"
                    }
                    alt="img"
                  />
                </a>
              </div>
              {/* Left column for content */}
              <CardContent>
                {/* label */}
                <p className="uppercase mb-4 tracking-wide font-semibold text-magenta text-center lg:text-left">
                  Join us for our next webinar on Nov. 18!
                </p>
                {/* Big title */}
                <h1
                  className="title mb-4 text-center lg:text-left"
                  // style={{ maxWidth: "200px" }}
                >
                  Metadata 101: Adding Value to HEAL Data
                </h1>
                {/* Description paragraph */}
                <div className="text-xl mb-4 text-grey text-center pl-10 pr-10 lg:text-left lg:pl-0 lg:pr-0">
                  <p>
                    Properly preparing study data for use and re-use is the key
                    to maximizing its potential value and impacts for diverse
                    audiences. This third webinar in our Fresh FAIR series
                    introduces the topic of metadata, a core focus for ensuring
                    data is accessible for computation and further research.
                    Metadata - or put simply “data about data” - increases the
                    value of HEAL data for the research community by ensuring
                    that data is findable and accessible for reuse.    Platform.
                    <br></br>
                    <br></br>
                    <a
                      target="_blank"
                      href="https://renci.zoom.us/webinar/register/WN_5MzNx9ZARPKDkCW9aSJ5bA"
                      style={{ color: "blue" }}
                      rel="noreferrer"
                    >
                      REGISTER NOW
                    </a>{" "}
                    to join John Cheadle of the HEAL Data Stewardship Group as
                    he leads a brief introductory session about metadata and its
                    use, which will be followed by a conversation with two HEAL
                    Investigators currently utilizing metadata in their daily
                    work.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
        <div className="embla__slide container">
          <Card
            className="flex flex-col md:flex-row items-center justify-between"
            style={{ minHeight: "500px", background: "#0000000a" }}
          >
            <div className="flex flex-wrap lg:flex-nowrap lg:p-14">
              <div className="flex-shrink-0 w-full lg:w-6/12 lg:p-14">
                <a
                  href="https://healdata.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="img-fix"
                >
                  <Image
                    width="800px"
                    height="500px"
                    layout="intrinsic"
                    src={
                      "https://heal-community-portal-api.s3.amazonaws.com/small_carousel2_c0d502c422.jpeg"
                    }
                    alt="img"
                  />
                </a>
              </div>
              {/* Left column for content */}
              <CardContent>
                {/* label */}
                {/* <p className="uppercase mb-4 tracking-wide font-semibold text-white text-center lg:text-left">
                  {"Coming Soon!"}
                </p> */}
                {/* Big title */}
                <h1
                  className="title mb-4 text-center lg:text-left"
                  // style={{ maxWidth: "200px" }}
                >
                  Resources coming soon!
                </h1>
                {/* Description paragraph */}
                <div className="text-xl mb-4 text-grey text-center pl-10 pr-10 lg:text-left lg:pl-0 lg:pr-0">
                  <p>
                    The Data Stewards are here to help with data management and
                    making data FAIR. We understand that each study has unique
                    needs and is at different stages of conducting
                    investigation. We will be publishing a{" "}
                    <Link href={"/resources"} passHref>
                      <BlueLink>series of general recommendations</BlueLink>
                    </Link>{" "}
                    this Fall that are intended to provide support to HEAL
                    studies as they move through their own data lifecycle.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
      {/* <div className="container flex pb-6 pt-6">
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        https://codesandbox.io/s/embla-carousel-arrows-dots-react-forked-l5mc2?file=/src/js/EmblaCarousel.js:773-863
      </div> */}
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
