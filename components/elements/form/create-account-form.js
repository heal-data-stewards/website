import { fetchAPI } from "utils/api"
import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import { Btn2 } from "../button"
import React, { useState } from "react"
import { TextField, Select } from "formik-material-ui"
import InputLabel from "@material-ui/core/InputLabel"

const CreateAccountForm = () => {
  const [loadingWheel, setLoadingWheel] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  const RegistrationSchema = yup.object().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    password: yup.string().required(),
    lastname: yup.string().required(),
    organization: yup.string().required(),
    userrole: yup.string().required(),
  })

  return (
    <div
      className="text-center"
      style={{
        margin: "0 auto",
      }}
    >
      <div className="flex flex-col items-center">
        <Formik
          // enableReinitialize={true}
          initialValues={{
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            organization: "",
            userrole: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values, actions) => {
            actions.setStatus({
              success: "Your account is now awaiting approval",
            })
            try {
              actions.setErrors({ api: null })
              const response = await fetchAPI("/auth/local/register", {
                method: "post",
                body: JSON.stringify({
                  email: values.email,
                  firstname: values.firstname,
                  organization: values.organization,
                  lastname: values.lastname,
                  password: values.password,
                  username: values.email,
                  userrole: values.userrole,
                  // location: data.location,
                }),
              })
              setSuccessMessage(true)
            } catch (err) {
              if (err.message === "Failed to fetch") {
                console.log("failed to fetch")
              } else {
                setSuccessMessage(false)
                actions.setErrors({ api: err.message })
              }
            }
          }}
        >
          {({ errors, touched, isSubmitting, status, values }) => (
            <div style={{ width: "100%" }}>
              <Form className="flex flex-wrap flex-col md:flex-row gap-4">
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 border-purple rounded-md bg-white"
                  type="text"
                  name="firstname"
                  label={"First Name"}
                  placeholder={"First Name"}
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 bg-white rounded-md"
                  type="text"
                  name="lastname"
                  label={"Last Name"}
                  placeholder={"Last Name"}
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 bg-white rounded-md"
                  type="text"
                  name="email"
                  label={"Email"}
                  placeholder={"Email"}
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                />{" "}
                {errors.api && (
                  <>
                    <p style={{ color: "red" }}>Email already exists</p>
                  </>
                )}
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 bg-white rounded-md"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder={"Password"}
                  required
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 bg-white rounded-md"
                  type="text"
                  name="organization"
                  label="Organization"
                  placeholder={"Organization"}
                  component={TextField}
                  variant="outlined"
                  required
                  fullWidth
                />
                <InputLabel htmlFor="userrole">
                  What is your role in the HEAL Initiative?
                </InputLabel>
                <Field
                  as="select"
                  name="userrole"
                  inputProps={{
                    id: "userrole",
                  }}
                  component={Select}
                  // placeholder={"What is your role in the HEAL Initiative?"}
                  required
                  fullWidth
                  style={{ width: "100%", background: "#fff" }}
                  variant="outlined"
                >
                  <option
                    value="Working on a HEAL-funded program"
                    style={{ cursor: "pointer" }}
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  >
                    Working on a HEAL-funded program
                  </option>
                  <option
                    style={{ cursor: "pointer" }}
                    value="Community Member"
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  >
                    Community Member
                  </option>
                  <option
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                    style={{ cursor: "pointer" }}
                    value="Representative of a Community Organization"
                  >
                    Representative of a Community Organization
                  </option>
                  <option
                    style={{ cursor: "pointer" }}
                    value="Clinician"
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  >
                    Clinician
                  </option>
                  <option
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                    style={{ cursor: "pointer" }}
                    value="Non-HEAL Researcher"
                  >
                    Non-HEAL Researcher
                  </option>
                  <option
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                    style={{ cursor: "pointer" }}
                    value="Agency"
                  >
                    Agency
                  </option>
                  <option
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                    style={{ cursor: "pointer" }}
                    value="Partner"
                  >
                    Partner
                  </option>
                  <option
                    className="text-base hover:text-magenta focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                    style={{ cursor: "pointer" }}
                    value="Other"
                  >
                    Other
                  </option>
                </Field>
                <Btn2
                  type="submit"
                  button={{ text: "Sign Up" }}
                  disabled={isSubmitting}
                  loading={loadingWheel}
                  height={"40px"}
                />{" "}
                {errors.api && (
                  <>
                    <span style={{ color: "red", margin: "10px" }}>
                      {errors.api}
                    </span>
                  </>
                )}
                {successMessage && (
                  <span style={{ color: "green", margin: "10px" }}>
                    {status.success}
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

export default CreateAccountForm
