import RegisterSuccess from "./RegisterSuccess";

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ premium?: string; token?: string }>;
}) {
  const params = await searchParams;
  const isPremium = params.premium === "true";
  const payToken = params.token;

  return <RegisterSuccess isPremium={isPremium} payToken={payToken} />;
}
