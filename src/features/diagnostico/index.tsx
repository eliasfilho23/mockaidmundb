import { DiagnosticoStep1 } from "./diagnostico-step-1";
import { useDiagnosisStore } from "@/hooks";
import DiagnosticoStep2 from "./diagnostico-step-2";
import { useState } from "react";

export const DiagnosticoSteps = () => {
  interface resPropsWithFile {
    exam_type: string
    file: any
    original_filename: string
    patient_sex_considered: null | string
    results: {condition_name: string, probability: number}[]
  }
  const currentStep = useDiagnosisStore((state) => state.diagnosticoStep);
  const [req, setReq] = useState<resPropsWithFile>()

  if (currentStep === 1) {
    // return <DiagnosticoStep2 req={req} setReq={setReq} />;
    return <DiagnosticoStep1 setReq={setReq} />;
  } else {
    return <DiagnosticoStep2 req={req} setReq={setReq} />;
  }
};
