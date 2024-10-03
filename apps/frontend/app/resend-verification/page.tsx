import { useEffect } from "react";
import { useRouter } from "next/router";

export default function EmailVerificationPage() {
  const router = useRouter();

  useEffect(() => {
    const token = router.query.token;
    if (token) {
      localStorage.setItem("token", token as string);
      router.push("/");
    }
  }, [router]);

  return <div>Verificando email...</div>;
}
