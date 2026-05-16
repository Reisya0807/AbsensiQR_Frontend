import React from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function handleObjectChange<T extends object>(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  setState: SetState<T>
) {
  const target = e.target;
  const name = target.name as keyof T & string;
  const type = (target as HTMLInputElement).type;
  const rawValue = target.value;

  let nextValue: unknown;
  if (type === "number") {
    nextValue = rawValue === "" ? "" : Number(rawValue);
  } else if (type === "checkbox") {
    nextValue = (target as HTMLInputElement).checked;
  } else {
    nextValue = rawValue;
  }

  setState((prev) => ({
    ...prev,
    [name]: nextValue,
  }));
}
