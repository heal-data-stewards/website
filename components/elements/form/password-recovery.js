import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import { Btn2 } from "../button"
import React, { useState } from "react"
import { TextField } from "formik-material-ui"
import { forgottenPassword } from "utils/api"

const NewPasswordForm = () => {
  const [errorNotice, setError] = useState(false)
  const [successNotice, setSuccess] = useState(false)

  const RegistrationSchema = yup.object().shape({
    email: yup.string().required(),
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
            email: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={(values, { resetForm }) => {
            const email = values.email
            forgottenPassword(email).then((res) => {
              if (res.status !== 200) {
                resetForm()
                setError(true)
                setSuccess(false)
              } else if (res.status === 200) {
                // console.log(res.config.data)
                resetForm()
                setError(false)
                setSuccess(true)
              }
            })
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div>
              <Form className="flex flex-wrap flex-col md:flex-row gap-4">
                {!successNotice && (
                  <>
                    <Field
                      className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                      type="email"
                      name="email"
                      placeholder={"Email"}
                      component={TextField}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      style={{ background: "white" }}
                    />
                    <Btn2
                      type="submit"
                      button={{ text: "Submit" }}
                      disabled={isSubmitting}
                    />
                  </>
                )}
                {errorNotice && (
                  <span style={{ color: "red", margin: "7px 0 0 0" }}>
                    This email was not found. Please contact an admin or try a
                    different email.
                  </span>
                )}
                {successNotice && (
                  <span style={{ color: "green", margin: "7px 0 0 0" }}>
                    An email has been sent with instructions on how to reset
                    your password.
                  </span>
                )}
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  )
}
export default NewPasswordForm
