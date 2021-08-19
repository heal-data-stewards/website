// import { useState } from "react";
// import { fetchAPI } from "utils/api";
// import * as yup from "yup";
// import { Formik, Form, Field } from "formik";
// import { Btn2 } from "../button";
// import React from "react";
// import { TextField } from "formik-material-ui";
// import {
//   signIn,
//   signOut,
//   useSession,
//   getSession,
//   getCsrfToken,
// } from "next-auth/client";

// const LoginForm = (context) => {
//   const [loading1, setLoading] = useState(false);
//   const [session, loading] = useSession();
//   const [csr, setCsr] = useState("");

//   async function myFunction() {
//     const csrfToken = await getCsrfToken();
//     /* ... */
//     console.log(session);
//     setCsr(csrfToken);
//   }
//   myFunction();

//   const RegistrationSchema = yup.object().shape({
//     username: yup.string().required(),
//     password: yup.string().required(),
//     csrfToken: yup.string(),
//   });

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
//             username: "",
//             password: "",
//             csrfToken: "",
//           }}
//           validationSchema={RegistrationSchema}
//           onSubmit={async (values, { setSubmitting, setErrors }) => {
//             setLoading(true);

//             try {
//               setErrors({ api: null });
//               const create = await fetch(
//                 "http://3.216.235.213:1337/api/auth/callback/credentials",
//                 {
//                   method: "POST",
//                   body: JSON.stringify({
//                     password: values.password,
//                     username: values.username,
//                     csrfToken: csr,
//                   }),
//                 }
//               ).then(function (res) {
//                 console.log(res);
//               });
//             } catch (err) {
//               setErrors({ api: err.message });
//             }

//             setLoading(false);
//             setSubmitting(false);
//           }}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <div>
//               <Form className="flex flex-wrap flex-col md:flex-row gap-4">
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="username"
//                   name="username"
//                   placeholder={"User Name"}
//                   component={TextField}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 <Field
//                   className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
//                   type="passsword"
//                   name="password"
//                   placeholder={"Password"}
//                   component={TextField}
//                   variant="outlined"
//                   fullWidth
//                 />
//                 {/* <Btn2
//                   type="submit"
//                   button={{ text: "Log In" }}
//                   disabled={isSubmitting}
//                   loading={loading}
//                 /> */}
//                 <button type="submit">Log In</button>
//               </Form>
//               {/* <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
//                 {(errors.email && touched.email && errors.email) || errors.api}
//               </p> */}
//             </div>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// }

// export default LoginForm;

import { useState } from "react";
import { fetchAPI } from "utils/api";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { Btn2 } from "../button";
import React from "react";
import { TextField } from "formik-material-ui";
import {
  signIn,
  signOut,
  useSession,
  getSession,
  getCsrfToken,
} from "next-auth/client";

const LoginForm = (context) => {
  const [loading1, setLoading] = useState(false);
  const [session, loading] = useSession();

  const RegistrationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    csrfToken: yup.string(),
  });

  return (
    <div
      className="py-10 text-center"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div className="flex flex-col items-center">
        <Formik
          initialValues={{
            username: "",
            password: "",
            csrfToken: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={(values) => {
            const email = values.username;
            const password = values.password;
            signIn("credentials", {
              email,
              password,
              // The page where you want to redirect to after a
              // successful login
              callbackUrl: `${window.location.origin}/account`,
            });
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div>
              <Form className="flex flex-wrap flex-col md:flex-row gap-4">
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="username"
                  name="username"
                  placeholder={"User Name"}
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="passsword"
                  name="password"
                  placeholder={"Password"}
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />
                <Btn2
                  type="submit"
                  button={{ text: "Log In" }}
                  disabled={isSubmitting}
                  loading={loading}
                />
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default LoginForm;
