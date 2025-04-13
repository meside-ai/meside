import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
} from "@rjsf/utils";

import BaseInputTemplate from "./BaseInputTemplate";
import SubmitButton from "./ButtonTemplates/SubmitButton";
import ErrorListTemplate from "./ErrorListTemplate";
import FieldErrorTemplate from "./FieldErrorTemplate";
import FieldTemplate from "./FieldTemplate";

import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import AddButton from "./ButtonTemplates/AddButton";
import {
  CopyButton,
  MoveDownButton,
  MoveUpButton,
  RemoveButton,
} from "./ButtonTemplates/IconButton";
import DescriptionFieldTemplate from "./DescriptionFieldTemplate";
import FieldHelpTemplate from "./FieldHelpTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import TitleFieldTemplate from "./TitleFieldTemplate";
import WrapIfAdditionalTemplate from "./WrapIfAdditionalTemplate";

export function generateTemplates<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  F extends FormContextType = any,
>(): Partial<TemplatesType<T, S, F>> {
  const ButtonTemplates = {
    SubmitButton,
    AddButton,
    RemoveButton,
    CopyButton,
    MoveDownButton,
    MoveUpButton,
  };
  return {
    ArrayFieldItemTemplate,
    ArrayFieldTemplate,
    BaseInputTemplate,
    FieldErrorTemplate,
    ErrorListTemplate,
    ButtonTemplates,
    FieldTemplate,
    FieldHelpTemplate,
    WrapIfAdditionalTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate,
    DescriptionFieldTemplate,
  };
}

export default generateTemplates();
