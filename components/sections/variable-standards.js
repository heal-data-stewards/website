import React, { useState, useEffect } from "react"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormControl from "@mui/material/FormControl"
import CircleIcon from "@mui/icons-material/Circle"
import WarningIcon from "@mui/icons-material/Warning"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import Checkbox from "@mui/material/Checkbox"
import TripOriginIcon from "@mui/icons-material/TripOrigin"
import { fetchAPI } from "utils/api"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Markdown from "../elements/markdown"
import { CSVLink, CSVDownload } from "react-csv"
import { OutlinedInput } from "@mui/material"
import { ListItemText } from "@mui/material"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"

const rules = [
  {
    title: "CDASH",
    description:
      "A suite of standards used in clinical research for data exchange",
    card: 1,
    link: "https://www.cdisc.org/standards/foundational/cdash",
  },
  {
    title: "ChEBI",
    description:
      "Chemical Entities of Biological Interest (ChEBI) is a dictionary of molecular entities focused on ‘small’ chemical compounds",
    card: 1,
    link: "http://www.ebi.ac.uk/chebi/",
  },
  {
    title: "HUPO PSI",
    description:
      "Proteomic Standard Initiative (PSI) provide a consensus annotation system to standardize the meaning, syntax and formalism of proteomics terms",
    card: 1,
    link: "https://www.psidev.info/groups/controlled-vocabularies",
  },
  {
    title: "ICD",
    description:
      "Clinical terms coded with ICD are the main basis for health recording and statistics on disease in primary, secondary and tertiary care, as well as on cause of death certificates",
    card: 1,
    link: "http://www.who.int/classifications/icd/en/",
  },
  {
    title: "LOINC",
    description:
      "Logical Observation Identifiers Names, and Codes (LOINC) is used for tests, observations and measurements",
    card: 1,
    link: "https://loinc.org/",
  },
  {
    title: "MGED",
    description:
      "Concepts, definitions, terms, and resources for standardized description of a microarray experiment in support of MAGE v.1",
    card: 1,
    link: "https://bioportal.bioontology.org/ontologies/MO",
  },
  {
    title: "NIH CDE",
    description:
      "Structured human and machine-readable definitions of data elements that have been recommended or required by NIH Institutes and Centers and other organizations for use in research and for other purposes",
    card: 1,
    link: "https://cde.nlm.nih.gov/home",
  },
  {
    title: "OMOP",
    description:
      "Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) is an open community data standard, designed to standardize the structure and content of observational data and to enable efficient analyses that can produce reliable evidence. A central component of the OMOP CDM is the OHDSI standardized vocabularies.",
    card: 1,
    link: "https://ohdsi.github.io/CommonDataModel/index.html",
  },
  {
    title: "Rx Norm",
    description:
      "Provides normalized names for clinical drugs and links its names to many drug vocabularies",
    card: 1,
    link: "https://www.nlm.nih.gov/research/umls/rxnorm/",
  },
  {
    title: "SNOMED-CT",
    description:
      "One of a suite of designated standards for use in U.S. Federal Government systems for the electronic exchange of clinical health information and is also a required standard in interoperability specifications of the U.S. Healthcare Information Technology Standards Panel.",
    card: 1,
    link: "https://www.nlm.nih.gov/research/umls/Snomed/snomed_main.html",
  },
  {
    title: "DDI Codebook ",
    description:
      "Based on the Data Documentation Initiative standard, the DDI Codebook enables basic descriptive content for variables, files, source material, and study level information. Supports discovery, preservation, and the informed use of data. ",
    card: 1,
    link: "https://ddialliance.org/Specification/DDI-Codebook/2.5/",
  },
  {
    title: "HEAL CDE",
    description:
      "Nine core pain domains and questionnaires to measure them, designed for studies examining acute pain and chronic pain in adults and pediatric populations",
    card: 1,
    link: "https://heal.nih.gov/data/common-data-elements",
  },
  {
    title: "Data Coordinating Center (DCC) Standards",
    description:
      "Contact your Data Coordinating Center to determine if they require the use of any specific variable standards.",
    card: 1,
    link: "#",
  },
  {
    title: "NIH Funding Institute/Center Standards",
    description:
      "Review your IC's data sharing policies to determine if your IC requires the use of any specific variable standards.",
    card: 1,
    link: "#",
  },
]

const questions = [
  {
    var_name: "specific_study_yn",
    type: "start",
    question: "Do you have a specific HEAL-funded award in mind?",
    choices: [
      { rec_req: 3, choice: "Yes", rule: "NIH CDE" },
      { rec_req: false, choice: "No", rule: false },
    ],
  },
]

// rec_req: 1 means default, 2 means required, 3 means recommended
const YesQuestions = [
  {
    var_name: "research_focus_area",
    type: "single",
    question: "Which HEAL Research Focus Area does the award fall under?",
    additionalInfo:
      "If you aren't sure, you can find your award's focus area at: https://heal.nih.gov/funding/awarded",
    choices: [
      {
        choice: "Clinical Research in Pain Management",
        rule: "HEAL CDE",
        rec_req: 2,
      },
      { choice: "Cross-Cutting Research", rule: "NIH CDE", rec_req: 3 },
      {
        choice: "Enhanced Outcomes for Infants and Children Exposed to Opioids",
        rule: "NIH CDE",
        rec_req: 3,
      },
      {
        choice: "New Strategies to Prevent and Treat Opioid Addiction",
        rule: "NIH CDE",
        rec_req: 3,
      },
      {
        choice:
          "Novel Therapeutic Options for Opioid Use Disorder and Overdose",
        rule: "NIH CDE",
        rec_req: 3,
      },
      {
        choice: "Preclinical and Translational Research in Pain Management",
        rule: "HEAL CDE",
        rec_req: 2,
      },
      {
        choice:
          "Translation of Research to Practice for the Treatment of Opioid Addiction",
        rule: "NIH CDE",
        rec_req: 3,
      },
    ],
  },
  {
    var_name: "award_type_excepts",
    type: "single",
    question:
      "Is the award a UG3, UH3, Small Business Programs (SBIR/STTR) award, or does it include data about American Indian/Alaska Native (AI/AN) populations ?",
    additionalInfo:
      "If you aren't sure of the award type, see 'Deciphering NIH Application / Grant Numbers' at https://www.era.nih.gov/files/Deciphering_NIH_Application.pdf Learn more about NIH's Small Business Programs at https://seed.nih.gov/small-business-funding ",
    choices: [
      { rec_req: 3, choice: "Yes", rule: "NIH CDE" },
      { rec_req: false, choice: "No", rule: false },
    ],
  },
  {
    var_name: "dcc_yn",
    type: "single",
    question:
      "Is the award associated with any of the following consortium awards?",
    additionalInfo: "",
    choices: [
      {
        choice:
          "Advancing Clinical Trials in Neonatal Opioid Withdrawal (ACT NOW)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "Back Pain Consortium Research Program (BACPAC)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "Early Phase Pain Investigation Clinical Network (EPPIC-Net)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice:
          "Harm Reduction Approaches to Reduce Overdose Death (Harm Reduction)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "HEAL Prevention Cooperative (HPC)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "HEALing Communities (HEALing Communities)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "HEALthy Brain and Child Development Study (HBCD)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice:
          "Integrated Approach to Pain and Opioid Use in Hemodialysis Patients (HOPE)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice:
          "Integrated Management of Chronic Pain and OUD for Whole Recovery (IMPOWR)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "Justice Community of Opioid Innovation Network (JCOIN)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "Pain Management Effectiveness Research Network (Pain ERN)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "PRECISION ",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "Restoring Joint Health and Function to Reduce Pain (RE-JOIN)",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
      {
        choice: "I dont't know",
        rule: "Data Coordinating Center (DCC) Standards",
        rec_req: 2,
      },
    ],
  },
  // For this question they would like a textbox to start filtering through the choices
  {
    var_name: "funder",
    type: "single",
    question: "What is the funding NIH Institute or Center?",
    additionalInfo: "",
    choices: [
      {
        choice: "Fogarty International Center (FIC) ",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Center for Advancing Translational Sciences (NCATS)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Center for Complementary and Integrative Health (NCCIH)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Cancer Institute (NCI)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      { choice: "National Eye Institute (NEI)", rec_req: false, rule: false },
      {
        choice: "National Human Genome Research Institute (NHGRI)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Heart, Lung, and Blood Institute (NHLBI)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      {
        choice: "National Institute on Aging (NIA)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      {
        choice: "National Institute on Alcohol Abuse and Alcoholism (NIAAA)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      {
        choice: "National Institute of Allergy and Infectious Diseases (NIAID)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute of Arthritis and Musculoskeletal and Skin Diseases (NIAMS)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute of Biomedical Imaging and Bioengineering (NIBIB)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      {
        choice:
          "Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Institute on Drug Abuse (NIDA)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute on Deafness and Other Communication Disorders (NIDCD)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute of Dental and Craniofacial Research (NIDCR)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Institute of Environmental Health Sciences (NIEHS)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Institute of General Medical Sciences (NIGMS)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Institute of Mental Health (NIMH)",
        rec_req: 2,
        rule: "NIH Funding Institute/Center Standards",
      },
      {
        choice:
          "National Institute on Minority Health and Health Disparities (NIMHD)",
        rec_req: false,
        rule: false,
      },
      {
        choice:
          "National Institute of Neurological Disorders and Stroke (NINDS)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Institute of Nursing Research (NINR)",
        rec_req: false,
        rule: false,
      },
      {
        choice: "National Library of Medicine (NLM)",
        rec_req: false,
        rule: false,
      },
      { choice: "Office of the Director(OD)", rec_req: false, rule: false },
    ],
  },
]

const NoQuestions = [
  // {
  //   var_name: "study_stage",
  //   type: "multiple",
  //   question: "What type of research is it?",
  //   additionalInfo: "Select all that apply",
  //   choices: [
  //     "Pre-Research/Protocol Development",
  //     "Basic Research",
  //     "Pre-Clinical Research",
  //     "Clinical Research",
  //     "Implementation Research",
  //     "Post-market Research",
  //     "Business Development",
  //     "Epidemiologic Research",
  //     "Other",
  //   ],
  // },
  // {
  //   var_name: "study_subject_type",
  //   type: "multiple",
  //   question: "What is the study subject type?",
  //   additionalInfo: "Select all that apply",
  //   choices: [
  //     "Human (including human cell / tissue / tissue model)",
  //     "Animal (including animal cell / tissue / tissue model)",
  //     "Molecule (e.g. chemical compounds, drugs, protein engineering, protein crystallization, etc)",
  //     "Other",
  //   ],
  // },
]

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}

const Block = ({
  title,
  onMouseEnter,
  choice,
  setCompareList,
  compareList,
}) => {
  const [checked, setChecked] = React.useState(false)

  const handleChange = (event) => {
    if (checked == false) {
      setCompareList([...compareList, choice])
    } else {
      let filteredList = compareList.filter((item) => {
        return item != choice
      })
      setCompareList([...filteredList])
    }
    setChecked(event.target.checked)
  }
  return (
    <div
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background:
          "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        color: "rgba(83, 37, 101, 1)",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      // className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      <div style={{ display: "flex" }}>
        <Checkbox
          disableRipple
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          icon={<TripOriginIcon />}
          checkedIcon={<CircleIcon />}
        />
        <div>
          <div>{title}</div>
          <div style={{ fontWeight: "500", fontSize: "9px" }}>
            {choice.description}
          </div>
        </div>
      </div>
    </div>
  )
}

const RequiredBlock = ({
  title,
  onMouseEnter,
  choice,
  setCompareList,
  compareList,
}) => {
  const [checked, setChecked] = useState(false)

  const handleChange = (event) => {
    if (checked == false) {
      setCompareList([...compareList, choice])
    } else {
      let filteredList = compareList.filter((item) => {
        return item != choice
      })
      setCompareList([...filteredList])
    }
    setChecked(event.target.checked)
  }
  return (
    <div
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background: "linear-gradient(315deg, transparent 17px, #982568 0)",
        color: "white",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      // className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      <div style={{ display: "flex" }}>
        <Checkbox
          disableRipple
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          icon={<WarningIcon style={{ color: "white" }} />}
          checkedIcon={<WarningIcon />}
        />
        <div>
          <div>{title}</div>
          <div style={{ fontWeight: "500", fontSize: "9px" }}>
            {choice.description}
          </div>
        </div>
      </div>
    </div>
  )
}

const RecommendedBlock = ({
  title,
  onMouseEnter,
  choice,
  setCompareList,
  compareList,
}) => {
  const [checked, setChecked] = useState(false)

  const handleChange = (event) => {
    if (checked == false) {
      setCompareList([...compareList, choice])
    } else {
      let filteredList = compareList.filter((item) => {
        return item != choice
      })
      setCompareList([...filteredList])
    }
    setChecked(event.target.checked)
  }
  return (
    <div
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background:
          "linear-gradient(315deg, transparent 17px, rgba(83, 37, 101, 1) 0)",
        color: "white",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      // className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      <div style={{ display: "flex" }}>
        <Checkbox
          disableRipple
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          icon={<TripOriginIcon style={{ color: "#982568" }} />}
          checkedIcon={<CircleIcon style={{ color: "#982568" }} />}
        />
        <div>
          <div>{title}</div>
          <div style={{ fontWeight: "500", fontSize: "9px" }}>
            {choice.description}
          </div>
        </div>
      </div>
    </div>
  )
}

const SingleChoice = ({ q, value, handleChange }) => {
  return (
    <div key={q.question}>
      <div style={{ fontWeight: "bold", marginBottom: "7px" }}>
        {q.question}
      </div>
      <Markdown>{q.additionalInfo}</Markdown>
      <br></br>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={value}
          onChange={handleChange}
        >
          {q.choices.map((option, i) => {
            return (
              <FormControlLabel
                key={option.choice}
                value={option.choice}
                control={
                  <Radio id={[option.rec_req, q.question]} name={option.rule} />
                }
                label={option.choice}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
    </div>
  )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}

const MultipleChoice = ({ q, value, handleChange }) => {
  return (
    <div key={q.question}>
      <div style={{ fontWeight: "bold", marginBottom: "7px" }}>
        {q.question}
      </div>
      <br></br>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">
          {q.additionalInfo}
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          // renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {q.choices.map((answer) => (
            <MenuItem key={answer.choice} value={answer.choice}>
              <Checkbox checked={value.indexOf(answer) > -1} />
              <ListItemText primary={answer.choice} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

const Dropdown = ({ q }) => {
  return (
    <Autocomplete
      disablePortal
      id="dropdown"
      options={q.choices}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="choice" />}
    />
  )
}

const VariableStandards = ({ data }) => {
  const [compareList, setCompareList] = useState([])
  const [cardList, setCardList] = useState(rules)
  const [recommendedList, setRecommendedList] = useState([])
  const [requiredList, setRequiredList] = useState([])
  const [questionList, setQuestionList] = useState(questions)
  const [currentStep, setCurrentStep] = useState(1)
  const [value, setValue] = useState([])

  // useEffect(() => {
  //   // let dropDownQuestions = data.dropdown_vs.map((q) => {
  //   //   const [answer, setAnswer] = useState('');

  //   //   const handleChange = (event) => {
  //   //     setAnswer(event.target.value);
  //   //   };

  //   //   return (
  //   //     <div>
  //   //       <div style={{ fontWeight: "bold", marginBottom: "7px" }}>
  //   //         {q.question}
  //   //       </div>
  //   //       <div style={{ fontWeight: "400", marginBottom: "10px" }}>
  //   //         {q.more_info}
  //   //       </div>
  //   //       <Box sx={{ minWidth: 120 }}>
  //   //         <FormControl fullWidth>
  //   //           <InputLabel id="demo-simple-select-label">Select one below</InputLabel>
  //   //           <Select
  //   //             labelId="demo-simple-select-label"
  //   //             id="demo-simple-select"
  //   //             value={answer}
  //   //             label="Age"
  //   //             onChange={handleChange}
  //   //           >
  //   //             {q.answer_list.map(a => {
  //   //               return <MenuItem value={a.responses}>{a.responses}</MenuItem>
  //   //             })}
  //   //           </Select>
  //   //         </FormControl>
  //   //       </Box>
  //   //     </div>
  //   //   )
  //   // })

  //   setQuestionList([...data.dropdown_vs, ...data.single])
  //   // fetchAPI("/vlmds").then((res) => {
  //   //   setCardList(res)
  //   //   setRecommendedList(res)
  //   //   setRequiredList(res)
  //   // })
  // }, [data.single, data.dropdown_vs])
  // console.log(questionList)

  const handleChange = (event) => {
    // if (event.target.name) {
    //   const result = cardList.map((card) => {
    //     if (card.question && card.question == event.target.id[1] && card.title != event.target.name) {
    //       return { title: card.title, description: card.description, link: card.link, card: 1, question: event.target.id[1] }
    //     } else if (card.title == event.target.name) {
    //       return { title: card.title, description: card.description, link: card.link, card: event.target.id[0], question: event.target.id[1] }
    //     } else return card
    //   });

    if (event.target.name) {
      const result = cardList.map((card) => {
        if (card.question && card.question != event.target.id[1]) {
          // check if this card has been used by a different question
          return card
        } else if (card.question && card.question == event.target.id[1]) {
          // check if this card has been used by the same question
          if (card.title == event.target.name) {
            return {
              title: card.title,
              description: card.description,
              link: card.link,
              card: event.target.id[0],
              question: event.target.id[1],
            }
          } else
            return {
              title: card.title,
              description: card.description,
              link: card.link,
              card: 1,
            }
        } else if (card.title == event.target.name) {
          return {
            title: card.title,
            description: card.description,
            link: card.link,
            card: event.target.id[0],
            question: event.target.id[1],
          }
        } else return card
      })
      setCardList(result)
    }
    if (
      (currentStep === 1 && event.target.value === "Yes") ||
      (currentStep === 1 && event.target.value === "yes")
    ) {
      setValue([])
      setCurrentStep(2)
      setQuestionList([...questions, ...YesQuestions])
      setValue([event.target.value])
    } else if (
      (currentStep === 1 && event.target.value === "No") ||
      (currentStep === 1 && event.target.value === "no")
    ) {
      setValue([])
      setCurrentStep(2)
      setQuestionList([...questions, ...NoQuestions])
      setValue([event.target.value])
    } else {
      // console.log(event.target.value)
      setValue([event.target.value])
      // console.log(value)
    }
  }

  const handleMultipleChange = (event) => {
    setValue(
      // On autofill we get a stringified value.
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value
    )
  }

  return (
    <div className="container pb-4 mt-20">
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "35%",
            paddingRight: "7px",
            borderRight: "2px solid #532665",
          }}
        >
          {questionList
            .filter((q, i) => {
              return i + 1 == currentStep
            })
            .map((q) => {
              if (q.type == "single" || q.type == "start") {
                return (
                  <SingleChoice
                    var_name={q.var_name}
                    key={q.question}
                    handleChange={handleChange}
                    value={value}
                    q={q}
                  />
                )
              } else if ((q.type = "multiple")) {
                // return (
                //   <MultipleChoice
                //     var_name={q.var_name}
                //     key={q.question}
                //     handleChange={handleMultipleChange}
                //     value={value}
                //     q={q}
                //   />
                // )
              } else if ((q.type = "dropdown")) {
                return (
                  <Dropdown
                    // var_name={q.var_name}
                    key={q.question}
                    // handleChange={handleMultipleChange}
                    // value={value}
                    q={q}
                  />
                )
              }
            })}
          {currentStep > 1 && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-evenly",
                color: "#532665",
              }}
            >
              <button onClick={() => setCurrentStep(currentStep - 1)}>
                {"< back"}
              </button>
              {questionList.length > currentStep && (
                <button onClick={() => setCurrentStep(currentStep + 1)}>
                  {"next >"}
                </button>
              )}
            </div>
          )}
        </div>
        <div style={{ width: "65%" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              fontWeight: "bold",
              // top: "-76px",
              position: "relative",
              padding: "0 15px 15px",
              // borderRight: "2px solid #532666"
            }}
          >
            <div style={{ width: "100%", textAlign: "end" }}>
              <CircleIcon style={{ fill: "#992569" }} />{" "}
              <span>Recommended Resources</span>
            </div>
            <div style={{ width: "100%", textAlign: "end" }}>
              <WarningIcon style={{ fill: "rgb(83 38 101)" }} />{" "}
              <span>Required Resources</span>
            </div>
          </div>
          {compareList.length > 0 && (
            <Button
              style={{
                left: "calc(50% - 71px)",
                marginBottom: "10px",
              }}
              variant="contained"
            >
              <CSVLink data={compareList}>Download CSV</CSVLink>
            </Button>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "space-evenly",
              // marginTop: "-24px"
            }}
          >
            {cardList.map((choice, i) => {
              if (choice.card == 2) {
                return (
                  <RequiredBlock
                    key={i}
                    title={choice.title}
                    setCompareList={setCompareList}
                    compareList={compareList}
                    choice={choice}
                  />
                )
              } else if (choice.card == 3) {
                return (
                  <RecommendedBlock
                    key={i}
                    title={choice.title}
                    setCompareList={setCompareList}
                    compareList={compareList}
                    choice={choice}
                  />
                )
              } else {
                return (
                  <Block
                    // onMouseEnter={(e) => onHover(choice)}
                    key={i}
                    title={choice.title}
                    setCompareList={setCompareList}
                    compareList={compareList}
                    choice={choice}
                  />
                )
              }
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariableStandards
