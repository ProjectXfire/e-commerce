import { SizesForms } from '@/app/(dashboard)/components';
import { type IParams } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';

interface Props {
  params: IParams;
}

async function BillboardNewPage({ params }: Props): Promise<JSX.Element> {
  const size = await prismaDb.size.findUnique({ where: { id: params.sizeId } });

  return (
    <div className='flex-col flex-1 space-y-4 p-8 pt-6'>
      <SizesForms size={size} />
    </div>
  );
}
export default BillboardNewPage;
