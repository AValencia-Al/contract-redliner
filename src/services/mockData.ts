import { Clause, Insight } from "../types/contract";

export const mockClauses: Clause[] = [
  {
    id: "4",
    title: "Section 4. Limitation of Liability",
    body:
      "Except in cases of gross negligence or wilful misconduct, the total liability of the company shall not " +
      "exceed unlimited the amounts paid under this agreement.",
  },
  {
    id: "5a",
    title: "Section 5. Termination",
    body: "",
  },
  {
    id: "5b",
    title: "Section 5. Termination",
    body: "",
  },
];

export const mockInsights: Insight[] = [
  {
    id: "i1",
    title: "Limitation of Liability Clause",
    description:
      "This clause may expose the company to significant financial risk. Consider limiting liability.",
    severity: "high",
    primaryActionLabel: "Limit liability",
  },
  {
    id: "i2",
    title: "Consider changing ‘unlimited’ to ‘capped at’",
    description:
      "Limiting liability aligns this clause with industry standards.",
    severity: "medium",
  },
  {
    id: "i3",
    title: "Deviation from standard NDA",
    description:
      "Clause 7 differs from typical NDA terms. Recommend review by legal team.",
    severity: "medium",
  },
];
