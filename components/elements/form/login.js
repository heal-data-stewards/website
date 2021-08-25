import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import { Btn2 } from "../button"
import React from "react"
import { TextField } from "formik-material-ui"
import { signIn, useSession } from "next-auth/client"

const LoginForm = () => {
  const [session, loading] = useSession()

  const RegistrationSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
    csrfToken: yup.string(),
  })

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
            const email = values.username
            const password = values.password
            signIn("credentials", {
              email,
              password,
              // The page where you want to redirect to after a
              // successful login
              callbackUrl: `https://staging.healdatafair.org`,
            })
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
  )
}
export default LoginForm
