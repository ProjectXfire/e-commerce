import prismaDb from '@/lib/prismadb';

interface Props {
  params: IParams;
}

interface IParams {
  id: string;
}

async function DashboardPage({ params }: Props): Promise<JSX.Element> {
  const store = await prismaDb.store.findFirst({ where: { id: params.id } });

  return (
    <section>
      <p>{store?.name}</p>
    </section>
  );
}
export default DashboardPage;
