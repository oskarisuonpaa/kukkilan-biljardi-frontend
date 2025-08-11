interface ReserveTableDetailPageProps {
  params: { slug: string };
}

const ReserveTableDetailPage = ({ params }: ReserveTableDetailPageProps) => {
  return (
    <main>
      <h1>Reserve Table: {params.slug}</h1>
    </main>
  );
};

export default ReserveTableDetailPage;
