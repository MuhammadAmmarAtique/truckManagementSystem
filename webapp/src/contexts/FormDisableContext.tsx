// Context to disable all Job Form Fields except "jobReference" if jobStatus is "complete" during job Edit.
import { createContext, useContext } from "react";

export const FormDisableContext = createContext<boolean>(false);

export const useFormDisable = () => useContext(FormDisableContext);
