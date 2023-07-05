import { BillboardsForm } from '@/app/(dashboard)/components';
import prismaDb from '@/lib/prismadb';

async function BillboardNewPage({
  params
}: {
  params: { billboardId: string };
}): Promise<JSX.Element> {
  const billboard = await prismaDb.billboard.findUnique({ where: { id: params.billboardId } });

  return (
    <div className='flex-col flex-1 space-y-4 p-8 pt-6'>
      <BillboardsForm billboard={billboard} />
    </div>
  );
}
export default BillboardNewPage;
