import { useRouter } from "next/router"
import PageTitle from "@/components/sections/page-title"
import Hero from "@/components/sections/hero"
import LargeVideo from "@/components/sections/large-video"
import FeatureColumnsGroup from "@/components/sections/feature-columns-group"
import FeatureRowsGroup from "@/components/sections/feature-rows-group"
import BottomActions from "@/components/sections/bottom-actions"
import TestimonialsGroup from "@/components/sections/testimonials-group"
import RichText from "./sections/rich-text"
import Pricing from "./sections/pricing"
import Directory from "./sections/directory"
import SignIn from "./sections/sign-in"
import SignUp from "./sections/sign-up"
import BasicTable from "./sections/basic-table"
import EmblaCarousel from "./sections/carousel"
import Glossary from "./sections/glossary"
import Calendar from "./sections/calendar"
import Resources from "./sections/resources"
import ResourceBlocks from "./sections/resource-blocks"
import FAIRiswheel from "./sections/resources/FAIRiswheel"
import ConsortiumBlocks from "./sections/consortium-block"
import WorkingGroupTable from "./sections/table"
import WebinarItem from "./sections/webinar/webinar-item"
import WebinarBody from "./sections/webinar/webinar-body"
import Faqs from "@/components/sections/faqs"
import ResourceCards from "./sections/resources/resource-cards"
import NewPasswordResetForm from "./elements/form/password-reset"

// Map Strapi sections to section components
const sectionComponents = {
  "sections.pageheading": PageTitle,
  "sections.hero": Hero,
  "sections.large-video": LargeVideo,
  "sections.feature-columns-group": FeatureColumnsGroup,
  "sections.feature-rows-group": FeatureRowsGroup,
  "sections.bottom-actions": BottomActions,
  "sections.testimonials-group": TestimonialsGroup,
  "sections.rich-text": RichText,
  "sections.pricing": Pricing,
  "sections.directory": Directory,
  "sections.sign-in": SignIn,
  "sections.signup": SignUp,
  "sections.resources": Resources,
  "sections.table": BasicTable,
  "sections.carousel": EmblaCarousel,
  "sections.glossary-term-and-definition": Glossary,
  "sections.calendarbody": Calendar,
  "sections.resourceblocksection": ResourceBlocks,
  "sections.fairiswheel": FAIRiswheel,
  "sections.consortium": ConsortiumBlocks,
  "sections.members": WorkingGroupTable,
  "sections.webinar-item": WebinarItem,
  "sections.webinarbody": WebinarBody,
  "sections.faqs": Faqs,
  "sections.resource-cards": ResourceCards,
  "sections.password-reset": NewPasswordResetForm,
}

// Display a section individually
const Section = ({ sectionData, eventData, token }) => {
  // Prepare the component
  const SectionComponent = sectionComponents[sectionData.__component]

  if (!SectionComponent) {
    return null
  }

  // Display the section
  return (
    <SectionComponent data={sectionData} eventData={eventData} token={token} />
  )
}

const PreviewModeBanner = () => {
  const router = useRouter()
  const exitURL = `/api/exit-preview?redirect=${encodeURIComponent(
    router.asPath
  )}`

  return (
    <div className="py-4 bg-red-600 text-red-100 font-semibold uppercase tracking-wide">
      <div className="container">
        Preview mode is on.{" "}
        <a
          className="underline"
          href={`/api/exit-preview?redirect=${router.asPath}`}
        >
          Turn off
        </a>
      </div>
    </div>
  )
}

// Display the list of sections
const Sections = ({ sections, preview, eventData, token }) => {
  return (
    <div className="flex flex-col">
      {/* Show a banner if preview mode is on */}
      {preview && <PreviewModeBanner />}
      {/* Show the actual sections */}
      {sections.map((section) => (
        <Section
          sectionData={section}
          eventData={eventData}
          key={`${section.__component}${section.id}`}
          token={token}
        />
      ))}
    </div>
  )
}

export default Sections
