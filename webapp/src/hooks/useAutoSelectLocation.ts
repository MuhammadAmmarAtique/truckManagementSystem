// Helper Function & Custom Hook used Inside JobRoute.tsx
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type IJobFormState from "@/entities/types/jobTypes";
import { contacts, locations } from "@/utils/jobConstants";

// Helper to get locations for a contact
export const getLocationsForContact = (contactValue: string) => {
  if (!contactValue) return [];

  const contact = contacts.find((c) => c.value === contactValue);
  if (!contact) return [];

  return Object.values(locations)
    .filter((loc) => loc.contactId === contact.id)
    .map((loc) => ({ value: loc.value, label: loc.label }));
};

// Custom hook
export const useAutoSelectLocation = (
  contactFieldName: keyof IJobFormState,
  locationFieldName: keyof IJobFormState,
  isEdit: boolean = false
) => {
  const { control, setValue } = useFormContext<IJobFormState>();

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  const contactValue = useWatch({ name: contactFieldName, control });

  useEffect(() => {
    // Skip auto-selection on initial mount when editing
    if (isEdit && isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const locationOptions = getLocationsForContact(contactValue as string);

    // Determine if we should validate based on whether it's initial mount
    const shouldValidateNow = !isInitialMount.current;

    if (contactValue && locationOptions.length === 1) {
      // Auto-select the single location
      setValue(
        locationFieldName,
        {
          value: locationOptions[0].value,
          label: locationOptions[0].label,
        },
        { shouldValidate: shouldValidateNow, shouldTouch: shouldValidateNow }
      );
    } else if (contactValue && locationOptions.length > 1) {
      // Multiple locations available
      // Only validate/clear if not in edit mode or if user is actively changing
      if (!isEdit || !isInitialMount.current) {
        const currentLocation = control._formValues[locationFieldName] as any;
        const isValidLocation = locationOptions.some(
          (opt) => opt.value === currentLocation?.value
        );

        if (!isValidLocation) {
          setValue(locationFieldName, null, {
            shouldValidate: shouldValidateNow,
            shouldTouch: false,
          });
        }
      }
    } else if (!contactValue) {
      // Clear location if contact is cleared (only if not initial mount)
      if (!isInitialMount.current) {
        setValue(locationFieldName, null, {
          shouldValidate: shouldValidateNow,
          shouldTouch: false,
        });
      }
    }
  }, [
    contactValue,
    setValue,
    locationFieldName,
    contactFieldName,
    isEdit,
    control,
  ]);

  // Mark initial mount as complete after first render (only once)
  useEffect(() => {
    // Set initial mount to false after a brief delay to ensure form is ready
    const timer = setTimeout(() => {
      isInitialMount.current = false;
    }, 0);

    return () => clearTimeout(timer);
  }, []);
};
