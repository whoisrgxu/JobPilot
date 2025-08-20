import RegisterSuccess from "./RegisterSuccess";

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ premium?: string }>;
}) {
  const params = await searchParams;
  const isPremium = params.premium === "true";

  return <RegisterSuccess isPremium={isPremium} />;
}
