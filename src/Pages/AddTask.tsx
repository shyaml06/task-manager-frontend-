import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AddTask() {

  const navigate = useNavigate();

  const schema = Yup.object({

    project_id: Yup.number().required(),
    title: Yup.string().required(),
    description: Yup.string().required(),
    status: Yup.string().required(),
    due_date: Yup.date().required(),

  });


  return (
    <div style={styles.container}>

      <h2>Add Task</h2>

      <Formik
        initialValues={{
          project_id: "",
          title: "",
          description: "",
          status: "pending",
          due_date: ""
        }}

        validationSchema={schema}

        onSubmit={async (values, { setSubmitting }) => {

          try {

            await axios.post(
              "http://localhost:8000/api/tasks/",
              values,
              { withCredentials: true }
            );

            alert("Task Added!");

            navigate("/tasks");

          } catch {

            alert("Failed to add task");

          } finally {
            setSubmitting(false);
          }
        }}
      >

        {({ isSubmitting }) => (

          <Form style={styles.form}>

            <Field name="project_id" placeholder="Project ID" />
            <ErrorMessage name="project_id" component="div" />

            <Field name="title" placeholder="Title" />
            <ErrorMessage name="title" component="div" />

            <Field
              name="description"
              placeholder="Description"
            />
            <ErrorMessage name="description" component="div" />

            <Field as="select" name="status">

              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>

            </Field>

            <ErrorMessage name="status" component="div" />

            <Field type="date" name="due_date" />
            <ErrorMessage name="due_date" component="div" />

            <button type="submit" disabled={isSubmitting}>
              Add Task
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>

          </Form>
        )}

      </Formik>

    </div>
  );
}


const styles = {

  container: {
    width: "350px",
    margin: "60px auto",
    textAlign: "center"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }
};
