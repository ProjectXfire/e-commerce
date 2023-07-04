import prismaDb from '@/lib/prismadb';
import { type IParams } from '@/app/shared/interfaces';

interface Props {
  params: IParams;
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
