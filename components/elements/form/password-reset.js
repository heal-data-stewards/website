import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import { Btn2 } from "../button"
import React, { useState } from "react"
import { TextField } from "formik-material-ui"
import { passwordReset } from "utils/api"

const NewPasswordResetForm = () => {
  const [errorNotice, setError] = useState(false)
  const [successNotice, setSuccess] = useState(false)

  const RegistrationSchema = yup.object().shape({
    pw: yup.string().required(),
    pwconfirm: yup.string().required(),
    code: yup.string().required(),
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
            pw: "",
            pwconfirm: "",
            code: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={(values, { resetForm }) => {
            const code = values.code
            const pw = values.pw
            const pwconfirm = values.pwconfirm
            passwordReset(code, pw, pwconfirm).then((res) => {
              if (res.status !== 200) {
                resetForm()
                setError(true)
                setSuccess(false)
              } else if (res.status === 200) {
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
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="text"
                  name="code"
                  placeholder={"Token"}
                  component={TextField}
                  label="Token"
                  variant="outlined"
                  fullWidth
                  style={{ background: "white" }}
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="password"
                  name="pw"
                  placeholder={"New Password"}
                  component={TextField}
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  style={{ background: "white" }}
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="password"
                  name="pwconfirm"
                  placeholder={"Confirm New Password"}
                  component={TextField}
                  label="Confirm New Password"
                  variant="outlined"
                  fullWidth
                  style={{ background: "white" }}
                />
                <Btn2
                  type="submit"
                  button={{ text: "Submit" }}
                  disabled={isSubmitting}
                />{" "}
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
export default NewPasswordResetForm
