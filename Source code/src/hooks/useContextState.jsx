import { useState, useEffect } from "react";

const ContextualValues = {};
const ContextualListeners = {};

export const useContextState = (
  name = "default",
  defaultValue = null,
  contextual = ContextualValues
) => {
  contextual[name] =
    contextual[name] === undefined ? defaultValue : contextual[name];
  ContextualListeners[name] = ContextualListeners[name] || {};
  const [value, setValue] = useState(contextual[name]);
  const [id] = useState(
    Math.random()
      .toString(32)
      .slice(2)
  );
  useEffect(() => {
    ContextualListeners[name][id] = setValue;
    return () => {
      delete ContextualListeners[name][id];
    };
  }, [id, name, contextual]);
  return [
    value,
    newValue => {
      console.log(Object.keys(ContextualListeners[name]));
      contextual[name] = newValue;
      for (let setValue of Object.values(ContextualListeners[name])) {
        setValue(newValue);
      }
    }
  ];
};
