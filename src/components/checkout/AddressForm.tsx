"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CheckoutFormData } from "@/schemas/checkout-schema";

interface AddressFormProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function AddressForm({ register, errors }: AddressFormProps) {
  return (
    <section className="card-surface space-y-4 p-5" aria-labelledby="address-heading">
      <h2 id="address-heading" className="font-sans text-lg font-semibold text-foreground">
        Delivery Address
      </h2>

      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-medium text-foreground">
          Address
        </label>
        <textarea
          id="address"
          rows={3}
          className="input min-h-[5.5rem] py-3"
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? "address-error" : undefined}
          {...register("address")}
        />
        {errors.address ? (
          <p id="address-error" className="mt-1.5 text-sm text-danger" role="alert">
            {errors.address.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="city"
          label="City"
          error={errors.city?.message}
          {...register("city")}
        />
        <Field
          id="state"
          label="State"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <Field
        id="pincode"
        label="Pincode"
        inputMode="numeric"
        autoComplete="postal-code"
        error={errors.pincode?.message}
        {...register("pincode")}
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
