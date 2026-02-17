"use client";

import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import css from "./NoteForm.module.css";
import { createNote } from "@/lib/api";
import type { CreateNotePayload, NoteTag } from "@/types/note";

type NoteFormProps = {
  onCancel: () => void;
  onSuccess?: () => void;
};

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const validationSchema = Yup.object({
  title: Yup.string().min(3, "Required").max(50, "Required").required("Required"),
  content: Yup.string().max(500, "Required"),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS).required("Required"),
});

const initialValues: CreateNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess?.();
    },
  });

  const handleSubmit = (
    values: CreateNotePayload,
    actions: FormikHelpers<CreateNotePayload>
  ) => {
    const payload: CreateNotePayload = {
      title: values.title.trim(),
      content: values.content.trim(), 
      tag: values.tag,
    };

    mutation.mutate(payload, {
      onSettled: () => actions.setSubmitting(false),
    });
  };

  return (
    <Formik<CreateNotePayload>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <span className={css.error}>
              <ErrorMessage name="title" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <span className={css.error}>
              <ErrorMessage name="content" />
            </span>
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <span className={css.error}>
              <ErrorMessage name="tag" />
            </span>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              Create note
            </button>
          </div>

          {mutation.isError && (
            <p className={css.error}>
              Error:{" "}
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Something went wrong"}
            </p>
          )}
        </Form>
      )}
    </Formik>
  );
}
