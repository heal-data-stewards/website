import { useState } from "react";
import { fetchAPI } from "utils/api";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import Button from "../button";
import React from "react";
import { TextField } from "formik-material-ui";
const axios = require("axios");
import { signIn, useSession } from "next-auth/client";

const EditForm = ({ data }) => {
  // const [loading, setLoading] = useState(false);
  const [session, loading] = useSession();

  const LeadSchema = yup.object().shape({
    firstname: yup.string(),
    lastname: yup.string(),
  });

  return (
    <div className="py-10 text-center">
      <h1 className="text-3xl mb-10 font-bold mb-2">Edit Form</h1>
      <div className="flex flex-col items-center">
        <Formik
          initialValues={{ firstname: "", lastname: "" }}
          validationSchema={LeadSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            // setLoading(true);
            console.log(session);
            try {
              const path = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/${session.id}`;
              setErrors({ api: null });
              const res = await axios.put(
                path,
                {
                  firstname: values.firstname,
                  lastname: values.lastname,
                },
                {
                  headers: {
                    Authorization: `Bearer ${session.jwt}`,
                  },
                }
              );
            } catch (err) {
              setErrors({ api: err.message });
            }
            signIn("email", session.user.email);
            // setLoading(false)
            // setSubmitting(false)
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div>
              <Form className="flex flex-wrap flex-col md:flex-row gap-4">
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="text"
                  name="firstname"
                  placeholder={"First Name"}
                  component={TextField}
                />
                <Field
                  className="text-base focus:outline-none py-4 md:py-0 px-4 border-2 rounded-md"
                  type="text"
                  name="lastname"
                  placeholder={"Last Name"}
                  component={TextField}
                />
                <button
                  type="submit"

                  // disabled={isSubmitting}
                  // loading={loading}
                >
                  submit
                </button>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditForm;
