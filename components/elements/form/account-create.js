import { useState } from "react";
import { fetchAPI } from "utils/api";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "../button";
import React from "react";
import { TextField } from "formik-material-ui";

const CreateAccountForm = ({ data }) => {
  const [loading, setLoading] = useState(false);

  const RegistrationSchema = yup.object().shape({
    email: yup.string().email().required(),
    firstname: yup.string().required(),
    password: yup.string().required(),
    lastname: yup.string().required(),
    organization: yup.string().required(),
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
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            organization: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setLoading(true);

            try {
              setErrors({ api: null });
              const create = await fetchAPI("/auth/local/register", {
                method: "POST",
                body: JSON.stringify({
                  email: values.email,
                  firstname: values.firstname,
                  organization: values.organization,
                  lastname: values.lastname,
                  password: values.password,
                  username: values.email,
                  // location: data.location,
                }),
              });
              console.log(create);
            } catch (err) {
              setErrors({ api: err.message });
            }

            setLoading(false);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div>
              <Form className="flex flex-wrap flex-col md:flex-row gap-4">
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="firstname"
                  name="firstname"
                  placeholder={"First Name"}
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />{" "}
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="lastname"
                  name="lastname"
                  placeholder={"Last Name"}
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="email"
                  name="email"
                  placeholder={"Email"}
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
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="organization"
                  name="organization"
                  placeholder={"Organization"}
                  component={TextField}
                  variant="outlined"
                  fullWidth
                />
                <Button
                  type="submit"
                  button={{ text: "Sign Up" }}
                  disabled={isSubmitting}
                  loading={loading}
                />
              </Form>
              {/* <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                {(errors.email && touched.email && errors.email) || errors.api}
              </p> */}
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateAccountForm;
