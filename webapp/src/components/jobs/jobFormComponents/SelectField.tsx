import React, { useState } from "react";
import { Typography, Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type IJobFormState from "@/entities/types/jobTypes";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps<T extends keyof IJobFormState> = {
  name: T;
  label: string;
  options: Option[];
  required?: boolean;
  sx?: object;
  disabled?: boolean;
  disableClear?: boolean;
  returnObject?: boolean;
  placeHolder?: string;
};

function SelectField<T extends keyof IJobFormState>({
  name,
  label,
  options,
  required = false,
  sx = {},
  disabled = false,
  disableClear,
  returnObject = false,
  placeHolder = "Select",
}: SelectFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<IJobFormState>();

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (_: any, value: string) => {
    setInputValue(value);
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const currentValue: Option | null = returnObject
            ? (field.value as Option) || null
            : options.find((opt) => opt.value === field.value) || null;

          return (
            <Autocomplete<Option, false, boolean, false>
              fullWidth
              disabled={disabled}
              disableClearable={disableClear}
              options={filteredOptions}
              getOptionLabel={(option) => option.label}
              value={currentValue}
              onChange={(_, selectedOption) => {
                if (returnObject) {
                  field.onChange(selectedOption || null);
                } else {
                  field.onChange(selectedOption ? selectedOption.value : "");
                }
              }}
              onInputChange={handleInputChange}
              loading={loading}
              noOptionsText={loading ? "Loading..." : "No records found"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={placeHolder}
                  error={!!errors[name]}
                  helperText={(errors[name] as any)?.message}
                  size="small"
                  InputProps={{
                    ...params.InputProps, 
                    sx: {
                      "& input::placeholder": {
                        fontSize: "0.85rem",
                        color: "#888",
                        opacity: 1,
                      },
                    },
                  }}
                  sx={{
                    ...sx,
                    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#d32f2f",
                      },
                    "& .MuiOutlinedInput-root.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline":
                      {
                        borderWidth: 2,
                      },
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === (value as Option)?.value
              }
            />
          );
        }}
      />
    </>
  );
}

export default SelectField;
