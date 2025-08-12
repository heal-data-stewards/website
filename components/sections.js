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
import WebinarBody from "./elements/webinar/webinar-body"
import Faqs from "@/components/sections/faqs"
import ResourceCards from "./sections/resources/resource-cards"
import NewPasswordResetForm from "./elements/form/password-reset"
import Boardlist from "./sections/collective-board/board-list"
import MetaDataBlocks from "./sections/metadata/metadata-blocks"
import GeneralDataTable from "./sections/table/general-table"
import RoadMap from "./sections/roadmap"
import Topics from "./sections/topics"
import CollectiveEvents from "./elements/webinar/collective"
import RichTextModal from "./sections/rich-text-modal"
import SensitiveData from "./sections/sensitive-data"
import DugSearch from "./sections/dug-search"
import DiTable from "./sections/table/di-table"
import DiBoxes from "./sections/di-boxes"
import { Widget } from "./sections/Widget"
import AppSearch from "./sections/app-search"
import SensitiveDataTree from "./sections/sensitive-data-tree"
import VariableStandards from "./sections/vlmd/variable-standards"
import PurpleBar from "./sections/purple-bar"
import RepoQuestions from "./sections/repo-questions"
import FloatingInfoBox from "./sections/floating-info-box"
import VerticalTabs from "./sections/vertical-tabs"
import Footnotes from "./sections/footnotes"
import ChecklistGraphic from "./sections/checklist-graphic/checklist-graphic"
import HeroButton from "./sections/hero-button"
import DataSharingStatus from "./sections/data-sharing-status"
import VerticalTabsWithAccordion from "./sections/vertical-tabs-with-accordion"

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
  "sections.general-data-table": GeneralDataTable,
  "sections.carousel": EmblaCarousel,
  "sections.glossary-term-and-definition": Glossary,
  "sections.calendarbody": Calendar,
  "sections.resourceblocksection": ResourceBlocks,
  "sections.fairiswheel": FAIRiswheel,
  "sections.consortium": ConsortiumBlocks,
  "sections.members": WorkingGroupTable,
  "sections.webinarbody": WebinarBody,
  "sections.faqs": Faqs,
  "sections.resource-cards": ResourceCards,
  "sections.password-reset": NewPasswordResetForm,
  "sections.public-collective": Boardlist,
  "sections.meta-data-content": MetaDataBlocks,
  "sections.roadmap": RoadMap,
  "sections.topics": Topics,
  "sections.collective-events": CollectiveEvents,
  "sections.rich-text-modal": RichTextModal,
  "sections.sensitive-data": SensitiveData,
  "sections.dug-search": DugSearch,
  "sections.di-page-table": DiTable,
  "sections.di-boxes": DiBoxes,
  "sections.feedback": Widget,
  "sections.app-search": AppSearch,
  "sections.sensitive-data-map": SensitiveDataTree,
  "sections.variable-standards": VariableStandards,
  "sections.purple-banner": PurpleBar,
  "sections.repo-questions": RepoQuestions,
  "sections.floating-info-box": FloatingInfoBox,
  "sections.vertical-tabs": VerticalTabs,
  "sections.footnotes": Footnotes,
  "sections.checklist-graphic": ChecklistGraphic,
  "sections.hero-button": HeroButton,
  "elements.data-sharing-status": DataSharingStatus,
  "sections.vertical-tabs-with-accordion": VerticalTabsWithAccordion,
}

// Display a section individually
const Section = ({ sectionData, eventData, token, glossary }) => {
  // Prepare the component
  const SectionComponent = sectionComponents[sectionData.__component]
  if (!SectionComponent) {
    return null
  }

  // Display the section
  return (
    <SectionComponent
      glossary={glossary}
      data={sectionData}
      eventData={eventData}
      token={token}
    />
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
const Sections = ({ sections, preview, eventData, token, glossary }) => {
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
          glossary={glossary}
        />
      ))}
    </div>
  )
}

export default Sections
