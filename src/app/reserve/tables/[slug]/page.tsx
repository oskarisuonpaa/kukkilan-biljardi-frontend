interface ReserveTableDetailPageProps {
  params: Promise<{ slug: string }>;
}

const ReserveTableDetailPage = async ({
  params,
}: ReserveTableDetailPageProps) => {
  const { slug } = await params;
  return (
    <main>
      <h1>Reserve Table: {slug}</h1>
    </main>
  );
};

export default ReserveTableDetailPage;
