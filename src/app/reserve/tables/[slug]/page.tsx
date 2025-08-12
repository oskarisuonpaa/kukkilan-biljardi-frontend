interface ReserveTableDetailPageProps {
  params: Promise<{ slug: string }>;
}

const ReserveTableDetailPage = async ({
  params,
}: ReserveTableDetailPageProps) => {
  const { slug } = await params;

  return (
    <main>
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header>
          <h1>Reserve Table: {slug}</h1>
        </header>
        <div className="flex flex-row gap-4">
          <div className="w-1/2">{/* Calendar here */}</div>
          <div>
            <form className="flex flex-col gap-2">
              <div className="mb-4 flex flex-row items-center gap-4">
                <label className="w-24 text-right" htmlFor="name">
                  Name:
                </label>
                <input
                  className="flex-1 p-2 rounded bg-gray-500 border-2 border-gray-700"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4 flex flex-row items-center gap-4">
                <label className="w-24 text-right" htmlFor="email">
                  Email:
                </label>
                <input
                  className="flex-1 p-2 rounded bg-gray-500 border-2 border-gray-700"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4 flex flex-row items-center gap-4">
                <label className="w-24 text-right" htmlFor="phone">
                  Phone:
                </label>
                <input
                  className="flex-1 p-2 rounded bg-gray-500 border-2 border-gray-700"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-4 flex flex-row items-center gap-4">
                <label className="w-24 text-right" htmlFor="details">
                  Details:
                </label>
                <textarea
                  className="flex-1 p-2 rounded bg-gray-500 border-2 border-gray-700"
                  id="details"
                  name="details"
                  placeholder="Enter reservation details"
                />
              </div>
              <button
                className="bg-blue-500 text-white p-2 rounded"
                type="submit"
              >
                Reserve
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReserveTableDetailPage;
