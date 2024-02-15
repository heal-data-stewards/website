// import * as yup from "yup"
// import { Formik, Form, Field } from "formik"
// import React from "react"
// import { TextField } from "formik-material-ui"
// const axios = require("axios")
// import { signIn, useSession } from "next-auth/client"
// import { Btn2 } from "../button"

// const EditForm = ({ setData, data, handleClose }) => {
//   // const [loading, setLoading] = useState(false);
//   const [session, loading] = useSession()

//   const LeadSchema = yup.object().shape({
//     firstname: yup.string(),
//     lastname: yup.string(),
//     organization: yup.string(),
//     email: yup.string(),
//     userrole: yup.string(),
//     programarea: yup.string(),
//     roleInProgramArea: yup.string(),
//   })

//   return (
//     <div className="py-10 text-center" style={{ maxWidth: "300px" }}>
//       <h1 className="text-3xl mb-10 font-bold mb-2">Edit Form</h1>
//       <div className="flex flex-col items-center">
//         <Formik
//           initialValues={{
//             firstname: data.firstname,
//             lastname: data.lastname,
//             organization: data.organization,
//             email: data.email,
//             userrole: data.userrole,
//             programarea: data.programarea,
//             roleInProgramArea: data.roleInProgramArea,
//           }}
//           validationSchema={LeadSchema}
//           onSubmit={async (values, { setSubmitting, setErrors }) => {
//             // setLoading(true);
//             try {
//               const path = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${session.id}`
//               setErrors({ api: null })
//               const res = await axios
//                 .put(
//                   path,
//                   {
//                     firstname: values.firstname,
//                     lastname: values.lastname,
//                     organization: values.organization,
//                     email: values.email,
//                     userrole: values.userrole,
//                     programarea: values.programarea,
//                     roleInProgramArea: values.roleInProgramArea,
//                   },
//                   {
//                     headers: {
//                       Authorization: `Bearer ${session.jwt}`,
//                     },
//                   }
//                 )
//                 .then((res) => {
//                   const data = res.data
//                   setData({ ...data })
//                   handleClose()
//                   // return;
//                 })
//             } catch (err) {
//               setErrors({ api: err.message })
//             }
//             // signIn();
//             // setLoading(false)
//             // setSubmitting(false)
//           }}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <div>
//               <Form className="flex flex-wrap flex-col md:flex-row gap-4">
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="text"
//                   name="firstname"
//                   placeholder={"First Name"}
//                   component={TextField}
//                 />
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="text"
//                   name="lastname"
//                   placeholder={"Last Name"}
//                   component={TextField}
//                 />
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="text"
//                   name="organization"
//                   placeholder={"Organization"}
//                   component={TextField}
//                 />{" "}
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="text"
//                   name="email"
//                   placeholder={"Email address"}
//                   component={TextField}
//                 />
//                 <Field as="select" name="userrole" style={{ width: "100%" }}>
//                   <option value="Working on a HEAL-funded program">
//                     Working on a HEAL-funded program
//                   </option>
//                   <option value="Community Member">Community Member</option>
//                   <option value="Representative of a Community Organization">
//                     Representative of a Community Organization
//                   </option>
//                   <option value="Clinician">Clinician</option>
//                   <option value="Non-HEAL Researcher">
//                     Non-HEAL Researcher
//                   </option>
//                   <option value="Agency">Agency</option>
//                   <option value="Partner">Partner</option>
//                   <option value="Other">Other</option>
//                 </Field>
//                 <Field as="select" name="programarea" style={{ width: "100%" }}>
//                   <option value="Discovery and Validation of Novel Targets for Safe and Effective Treatment of Pain">
//                     Discovery and Validation of Novel Targets for Safe and
//                     Effective Treatment of Pain
//                   </option>
//                   <option value="Development of Novel Drugs and Human Cell-Based Screening Platforms to Treat Pain and Opioid Use Disorder">
//                     Development of Novel Drugs and Human Cell-Based Screening
//                     Platforms to Treat Pain and Opioid Use Disorder
//                   </option>
//                   <option value="Optimizing Non-Addictive Therapies to Treat Pain">
//                     Optimizing Non-Addictive Therapies to Treat Pain
//                   </option>
//                   <option value="Translating Discoveries into Effective Devices to Treat Pain">
//                     Translating Discoveries into Effective Devices to Treat Pain
//                   </option>
//                   <option value="Discovery and Validation of Biomarkers, Endpoints, and Signatures for Pain Conditions">
//                     Discovery and Validation of Biomarkers, Endpoints, and
//                     Signatures for Pain Conditions
//                   </option>
//                   <option value="Back Pain Consortium Research Program (BACPAC)">
//                     Back Pain Consortium Research Program (BACPAC)
//                   </option>
//                   <option value="Pain Management Effectiveness Research Network (ERN)">
//                     Pain Management Effectiveness Research Network (ERN)
//                   </option>
//                   <option value="Pragmatic and Implementation Studies for the Management of Pain to Reduce Opioid Prescribing (PRISM)">
//                     Pragmatic and Implementation Studies for the Management of
//                     Pain to Reduce Opioid Prescribing (PRISM)
//                   </option>
//                   <option value="Early Phase Pain Investigation Clinical Network (EPPIC-Net)">
//                     Early Phase Pain Investigation Clinical Network (EPPIC-Net)
//                   </option>
//                   <option value="Integrated Approach to Pain and Opioid Use in Hemodialysis Patients (HOPE Consortium)">
//                     Integrated Approach to Pain and Opioid Use in Hemodialysis
//                     Patients (HOPE Consortium)
//                   </option>
//                   <option value="HEALing Communities Study">
//                     HEALing Communities Study
//                   </option>
//                   <option value="Enhancing the National Drug Abuse Treatment Clinical Trials Network to Address Opioids (CTN)">
//                     Enhancing the National Drug Abuse Treatment Clinical Trials
//                     Network to Address Opioids (CTN)
//                   </option>
//                   <option value="Justice Community Opioid Innovation Network (JCOIN)">
//                     Justice Community Opioid Innovation Network (JCOIN)
//                   </option>
//                   <option value="Behavioral Research to Improve Medication-Based Treatment (BRIM)">
//                     Behavioral Research to Improve Medication-Based Treatment
//                     (BRIM)
//                   </option>
//                   <option value="Optimizing Care for People with Opioid Use Disorder and Mental Health Conditions">
//                     Optimizing Care for People with Opioid Use Disorder and
//                     Mental Health Conditions
//                   </option>
//                   <option value="Preventing Opioid Use Disorder">
//                     Preventing Opioid Use Disorder
//                   </option>
//                   <option value="Sleep Dysfunction as a Core Feature of Opioid Use Disorder and Recovery">
//                     Sleep Dysfunction as a Core Feature of Opioid Use Disorder
//                     and Recovery
//                   </option>
//                   <option value="Advancing Clinical Trials in Neonatal Opioid Withdrawal (ACT NOW)">
//                     Advancing Clinical Trials in Neonatal Opioid Withdrawal (ACT
//                     NOW)
//                   </option>
//                   <option value="HEALthy Brain and Child Development Study">
//                     HEALthy Brain and Child Development Study
//                   </option>
//                   <option value="Focusing Medication Development to Prevent and Treat Opioid Use Disorder and Overdose">
//                     Focusing Medication Development to Prevent and Treat Opioid
//                     Use Disorder and Overdose
//                   </option>
//                   <option value="Immunotherapies for Opioids to Prevent Relapse and Overdose">
//                     Immunotherapies for Opioids to Prevent Relapse and Overdose
//                   </option>
//                   <option value="Small Business Innovation Research (SBIR)">
//                     Small Business Innovation Research (SBIR)
//                   </option>
//                   <option value="Small Business Technology Transfer (STTR)">
//                     Small Business Technology Transfer (STTR)
//                   </option>
//                   <option value="Not Applicable">Not Applicable</option>
//                 </Field>
//                 <Field
//                   as="select"
//                   name="roleInProgramArea"
//                   style={{ width: "100%" }}
//                 >
//                   <option value="NIH Program Officer">
//                     NIH Program Officer
//                   </option>
//                   <option value="NIH HEAL Program Staff">
//                     NIH HEAL Program Staff
//                   </option>
//                   <option value="Principal Investigator">
//                     Principal Investigator
//                   </option>
//                   <option value="HEAL Grant Project Manager">
//                     HEAL Grant Project Manager
//                   </option>
//                   <option value="HEAL Grant Data Manager">
//                     HEAL Grant Data Manager
//                   </option>
//                   <option value="HEAL Grant Key Personnel">
//                     HEAL Grant Key Personnel
//                   </option>
//                   <option value="Other">Other</option>
//                 </Field>
//                 <Btn2
//                   type="submit"
//                   button={{ text: "Submit" }}

//                   // disabled={isSubmitting}
//                   // loading={loading}
//                 />
//               </Form>
//             </div>
//           )}
//         </Formik>
//       </div>
//     </div>
//   )
// }

// export default EditForm
