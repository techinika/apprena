import { useEffect, useState } from "react";

const useIremboPay = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (
      document.querySelector(
        `script[src="${process.env.NEXT_PUBLIC_PAYMENT_PAGE_URL}"]`
      )
    ) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = process.env.NEXT_PUBLIC_PAYMENT_PAGE_URL ?? "";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return loaded;
};

export default useIremboPay;
