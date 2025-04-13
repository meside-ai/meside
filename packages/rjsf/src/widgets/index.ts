import type {
  FormContextType,
  RJSFSchema,
  RegistryWidgetsType,
  StrictRJSFSchema,
} from "@rjsf/utils";

import AltDateTimeWidget from "./AltDateTimeWidget";
import AltDateWidget from "./AltDateWidget";
import CheckboxWidget from "./CheckboxWidget";
import CheckboxesWidget from "./CheckboxesWidget";
import FileWidget from "./FileWidget";
import MantineDateTimeWidget from "./MantineDateTimeWidget";
import MantineDateWidget from "./MantineDateWidget";
import NullWidget from "./NullWidget";
import RadioWidget from "./RadioWidget";
import RangeWidget from "./RangeWidget";
import RatingWidget from "./RatingWidget";
import SelectWidget from "./SelectWidget";
import TextareaWidget from "./TextareaWidget";
import UpDownWidget from "./UpDownWidget";

export function generateWidgets<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(): RegistryWidgetsType<T, S, F> {
  return {
    CheckboxWidget,
    CheckboxesWidget,
    RadioWidget,
    SelectWidget,
    TextareaWidget,
    MantineDateTimeWidget,
    MantineDateWidget,
    AltDateWidget,
    AltDateTimeWidget,
    RangeWidget,
    RatingWidget,
    FileWidget,
    UpDownWidget,
    NullWidget,
  };
}

export default generateWidgets();
