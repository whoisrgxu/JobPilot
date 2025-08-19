import RegisterSuccess from "./RegisterSuccess";

export default function RegisterSuccessPage({ searchParams }: { searchParams: { premium?: string } }) {
  const isPremium = searchParams.premium === "true";
  return <RegisterSuccess isPremium={isPremium} />;
}
