// import * as yup from "yup"
// import { Formik, Form, Field } from "formik"
// import { Btn2 } from "../button"
// import React, { useState } from "react"
// import { TextField } from "formik-material-ui"
// import { passwordReset } from "utils/api"
// import { useRouter } from "next/router"

// const NewPasswordResetForm = () => {
//   const router = useRouter()
//   const [errorNotice, setError] = useState(false)
//   const [errorNoticePw, setErrorPw] = useState(false)
//   const [successNotice, setSuccess] = useState(false)

//   const RegistrationSchema = yup.object().shape({
//     pw: yup.string().required(),
//     pwconfirm: yup.string().required(),
//   })

//   return (
//     <div
//       className="py-10 text-center"
//       style={{
//         maxWidth: "600px",
//         margin: "0 auto",
//       }}
//     >
//       <div className="flex flex-col items-center">
//         <Formik
//           initialValues={{
//             pw: "",
//             pwconfirm: "",
//             code: router.asPath.split("=")[1],
//           }}
//           validationSchema={RegistrationSchema}
//           onSubmit={(values, { resetForm }) => {
//             const code = router.asPath.split("=")[1]
//             const pw = values.pw
//             const pwconfirm = values.pwconfirm
//             passwordReset(code, pw, pwconfirm).then((res) => {
//               if (res.status !== 200) {
//                 if (pw !== pwconfirm) {
//                   resetForm()
//                   setErrorPw(true)
//                   setSuccess(false)
//                 } else {
//                   resetForm()
//                   setError(true)
//                   setSuccess(false)
//                 }
//               } else if (res.status === 200) {
//                 resetForm()
//                 setError(false)
//                 setErrorPw(false)
//                 setSuccess(true)
//               }
//             })
//           }}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <div>
//               <Form className="flex flex-wrap flex-col md:flex-row gap-4">
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="password"
//                   name="pw"
//                   placeholder={"New Password"}
//                   component={TextField}
//                   label="New Password"
//                   variant="outlined"
//                   fullWidth
//                   style={{ background: "white" }}
//                 />
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="password"
//                   name="pwconfirm"
//                   placeholder={"Confirm New Password"}
//                   component={TextField}
//                   label="Confirm New Password"
//                   variant="outlined"
//                   fullWidth
//                   style={{ background: "white" }}
//                 />
//                 <Btn2
//                   type="submit"
//                   button={{ text: "Submit" }}
//                   disabled={isSubmitting}
//                 />{" "}
//                 {errorNotice && (
//                   <span style={{ color: "red", margin: "7px 0 0 0" }}>
//                     An error has occured. Double check your entries or please
//                     contact an admin.
//                   </span>
//                 )}
//                 {errorNoticePw && (
//                   <span style={{ color: "red", margin: "7px 0 0 0" }}>
//                     The passwords do not match. Please try again.
//                   </span>
//                 )}
//                 {successNotice && (
//                   <span style={{ color: "green", margin: "7px 0 0 0" }}>
//                     Your password has been updated successfully.
//                   </span>
//                 )}
//               </Form>
//             </div>
//           )}
//         </Formik>
//       </div>
//     </div>
//   )
// }
// export default NewPasswordResetForm
