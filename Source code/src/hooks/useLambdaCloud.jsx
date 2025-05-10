import { useState, useEffect } from "react";

export const useLambdaCloud = (protocol, fire = true) => {
  const {
    update,
    uri,
    groupID,
    nodeID,
    nodeTo,
    protocol: $protocol
  } = protocol;

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("lc-awake");

  useEffect(() => {
    if (!fire) {
      return;
    }

    let id = null;

    (async () => {
      console.log("xx--");

      await new Promise(resolve => {
        id = setInterval(() => {
          if (window.lambda) {
            console.log("Lambda Cloud - React Hook v1.0");
            clearInterval(id);
            resolve();
            return;
          }
          setStatus("waiting");
        }, 100);
      });
      if (!uri) {
        setStatus("lc-error");
        setResult("invalid uri");
        return;
      }

      if (!groupID) {
        setStatus("lc-error");
        setResult("invalid groupID");
        return;
      }

      if (!nodeID) {
        setStatus("lc-error");
        setResult("invalid nodeID");
        return;
      }

      if (!nodeTo) {
        setStatus("lc-error");
        setResult("invalid nodeTo");
        return;
      }

      setStatus("lc-start");

      const node = await window.lambda(groupID, nodeID, uri);

      setStatus("lc-join");

      console.log(
        `Lambda Cloud - React Hook v1.0 (node ${nodeID.slice(0, 8)})`
      );

      const result = await node.to(nodeTo, $protocol);

      node.close();

      setStatus("lc-close");

      setResult(result);
    })();

    return () => {
      clearInterval(id);
    };
  }, [update, fire]);

  useEffect(() => {
    if (status === "lc-close") {
      setStatus("lc-done");
    }
  }, [result]);

  return [status, result];
};
