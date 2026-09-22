"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CheckoutFormData } from "@/schemas/checkout-schema";

interface ContactInformationProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function ContactInformation({
  register,
  errors,
}: ContactInformationProps) {
  return (
    <section className="card-surface space-y-4 p-5" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="font-sans text-lg font-semibold text-foreground">
        Contact Information
      </h2>

      <Field
        id="fullName"
        label="Full Name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Field
        id="phone"
        label="Phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
    </section>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

function Field({ id, label, error, ...props }: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        className="input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
