// import * as yup from "yup"
// import { Formik, Form, Field } from "formik"
// import { Btn2 } from "../button"
// import React, { useState } from "react"
// import { TextField } from "formik-material-ui"
// import { signIn, useSession } from "next-auth/client"
// import { useRouter } from "next/router"

// const LoginForm = ({ setLoggedIn }) => {
//   const [session, loading] = useSession()
//   const [errorNotice, setError] = useState(false)
//   const router = useRouter()

//   const RegistrationSchema = yup.object().shape({
//     email: yup.string().required(),
//     password: yup.string().required(),
//     csrfToken: yup.string(),
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
//             email: "",
//             password: "",
//             csrfToken: "",
//           }}
//           validationSchema={RegistrationSchema}
//           onSubmit={(values, { resetForm }) => {
//             const email = values.email
//             const password = values.password
//             signIn("credentials", {
//               redirect: false,
//               email,
//               password,
//               // The page where you want to redirect to after a
//               // successful login
//               // callbackUrl: "https://staging.healdatafair.org/",
//             }).then((res) => {
//               // console.log(res);
//               if (res.status === 401) {
//                 resetForm()
//                 setError(true)
//               } else {
//                 localStorage.setItem("loggedIn", true)
//                 router.back()
//               }
//             })
//           }}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <div>
//               <Form className="flex flex-wrap flex-col md:flex-row gap-4">
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="email"
//                   name="email"
//                   placeholder={"Email"}
//                   component={TextField}
//                   label="Email"
//                   variant="outlined"
//                   fullWidth
//                   style={{ background: "white" }}
//                 />
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="password"
//                   name="password"
//                   placeholder={"Password"}
//                   component={TextField}
//                   label="Password"
//                   variant="outlined"
//                   style={{ background: "white" }}
//                   fullWidth
//                 />
//                 <Btn2
//                   type="submit"
//                   button={{ text: "Log In" }}
//                   disabled={isSubmitting}
//                   loading={loading}
//                 />{" "}
//                 {errorNotice && (
//                   <span style={{ color: "red", margin: "7px 0 0 0" }}>
//                     There has been an error. Please try again or contact an
//                     admin.
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
// export default LoginForm
